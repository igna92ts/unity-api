--[[USER LOGIN --]]
local function login(username,password)
    local user_id = tonumber(redis.call("hget","users:lookup:username",username))
    if (user_id ~= nil) then
        local userData = cjson.decode(redis.call("hget","users","user:" .. user_id))
        if userData["password"] == password then
            return 'OK';
        else
            return "WRONG_PASSWORD"
        end
    else
        return "WRONG_USERNAME"
    end
end

--[[USER CREATE ACCOUNT --]]
local function signup(username,password)
    local exists = tonumber(redis.call("hget","users:lookup:username",username))
    if (exists == nil) then 
        redis.call("setnx","users:index",0);
        local new_id = redis.call("incr","users:index");
        redis.call("hset","users:lookup:username",username,new_id)
        local userData = {}
        userData["username"] = username
        userData["password"] = password
        redis.call("hset","users","user:"..new_id,cjson.encode(userData))
        return "OK"
    else
        return "Username taken"
    end
end


local funcName = ARGV[1]
--[[SWITCH PARA VER QUE LLAMA --]]
if(funcName == "login()") then
    return login(KEYS[1],KEYS[2])
elseif(funcName == "signup()") then
    return signup(KEYS[1],KEYS[2])
end

