# AppContext

```java
package com.demo;

public class AppContext {

    public static ThreadLocal<Long> threadLocal = new ThreadLocal<>();

    public static void setCurrentUserId(Long id) {
        threadLocal.set(id);
    }

    public static Long getCurrentUserId() {
        return threadLocal.get();
    }

    public static void removeCurrentUserId() {
        threadLocal.remove();
    }

}
```