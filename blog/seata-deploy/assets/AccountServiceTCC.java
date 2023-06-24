package cn.itcast.account.service;

import io.seata.rm.tcc.api.BusinessActionContext;
import io.seata.rm.tcc.api.BusinessActionContextParameter;
import io.seata.rm.tcc.api.LocalTCC;
import io.seata.rm.tcc.api.TwoPhaseBusinessAction;

@LocalTCC
public interface AccountServiceTCC {
    /**
     * 从用户账户中借出
     */
    @TwoPhaseBusinessAction(name = "debit", commitMethod = "commitDebit", rollbackMethod = "cancelDebit")
    void debit(
            @BusinessActionContextParameter(paramName = "userId") String userId,
            @BusinessActionContextParameter(paramName = "money") int money);

    /**
     * 二阶段confirm确认方法、可以另命名，但要保证与commitMethod一致
     *
     * @param context 上下文,可以传递try方法的参数
     * @return boolean
     */
    boolean commitDebit(BusinessActionContext context);

    /**
     * 二阶段回滚方法，要保证与rollbackMethod一致
     *
     * @param context 上下文
     * @return boolean
     */
    boolean cancelDebit(BusinessActionContext context);
}