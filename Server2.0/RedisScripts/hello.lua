redis.call('set','users:jorge','{nombre:jorge}')
return redis.call('get','users:jorge')