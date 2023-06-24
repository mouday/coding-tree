package cn.itcast.account.service.impl;

import cn.itcast.account.entity.AccountFreeze;
import cn.itcast.account.mapper.AccountFreezeMapper;
import cn.itcast.account.mapper.AccountMapper;
import cn.itcast.account.service.AccountServiceTCC;
import io.seata.core.context.RootContext;
import io.seata.rm.tcc.api.BusinessActionContext;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import static cn.itcast.account.entity.AccountFreeze.State.CANCEL;
import static cn.itcast.account.entity.AccountFreeze.State.TRY;

/**
 * @author 虎哥
 */
@Slf4j
@Service
public class AccountServiceTCCImpl implements AccountServiceTCC {

    @Autowired
    private AccountMapper accountMapper;
    @Autowired
    private AccountFreezeMapper freezeMapper;

    @Override
    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public void debit(String userId, int money) {
        log.info("开始扣款");
        try {
            String xid = RootContext.getXID();
            // 1.判断xid是否已经存在
            AccountFreeze oldFreeze = freezeMapper.selectById(xid);
            if (oldFreeze != null) {
                // 说明已处理的请求，无需执行
                return;
            }

            // 2.尝试扣款
            accountMapper.debit(userId, money);
            // 3.冻结金额
            AccountFreeze freeze = new AccountFreeze();
            freeze.setXid(xid);
            freeze.setUserId(userId);
            freeze.setFreezeMoney(money);
            freeze.setState(TRY);
            freezeMapper.insert(freeze);

        } catch (Exception e) {
            throw new RuntimeException("扣款失败，可能是余额不足！");
        }
        log.info("扣款成功");
    }

    @Override
    public boolean commitDebit(BusinessActionContext context) {
        // 获取事务id
        String xid = context.getXid();
        // 提交，删除冻结数据即可
        return freezeMapper.deleteById(xid) == 1;
    }

    @Override
    public boolean cancelDebit(BusinessActionContext context) {
        // 1.获取事务id
        String xid = context.getXid();
        String userId = context.getActionContext("userId").toString();
        Integer money = (Integer) context.getActionContext("money");
        // 2.获取冻结数据，判断是否需要空回滚
        AccountFreeze freeze = freezeMapper.selectById(xid);
        if (freeze == null) {
            // 不存在，说明事务已经结束或尚未开始，需要空回滚
            // 插入一条xid记录
            freeze = new AccountFreeze();
            freeze.setXid(xid);
            freeze.setUserId(userId);
            freeze.setFreezeMoney(money);
            freeze.setState(CANCEL);
            freezeMapper.insert(freeze);
            // 空回滚
            return true;
        }
        // 3.判断幂等
        if (freeze.getState() == CANCEL) {
            // 已经处理过了
            return true;
        }
        // 4.回滚
        // 4.1.恢复用户金额
        accountMapper.recover(userId, money);
        // 4.2.修改冻结状态
        freeze.setState(CANCEL);
        int count = freezeMapper.updateById(freeze);
        return count == 1;
    }
}
