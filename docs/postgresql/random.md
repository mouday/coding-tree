
## pg_strong_random

```cpp
#include <stdio.h>
#include <stdbool.h>
#include <fcntl.h>
#include <unistd.h>
#include <errno.h>

bool pg_strong_random(void *buf, size_t len)
{
    int			f;
    char	   *p = buf;
    size_t		res;

    f = open("/dev/urandom", O_RDONLY, 0);
    if (f == -1)
        return false;

    while (len)
    {
        res = read(f, p, len);
        if (res <= 0)
        {
            if (errno == EINTR)
                continue;		/* interrupted by signal, just retry */

            close(f);
            return false;
        }

        p += res;
        len -= res;
    }

    close(f);
    return true;
}

// test
int main(int argc, char const *argv[])
{
    const size_t len = 10;
    char buf[len];

    pg_strong_random(buf, len);
    
    for (size_t i = 0; i < len; i++)
    {
        printf("%02x\n", buf[i]);
    }

    return 0;
}

```