--[[

CAMBIAR POR MUCHOS HASHES - LEER OPTIMIZACION DE MEMORIA EN REDIS

--]]

--[[USER LOGIN --]]
local function login(username,password)
    
    local user_id = tonumber(redis.call("hget","users:lookup:username",username))
    if (user_id ~= nil) then
        local userData = cjson.decode(redis.call("hget","users","user:" .. user_id))
        if userData["password"] == password then
            return 'LOGIN_OK';
        else
            return "WRONG_PASSWORD"
        end
    else
        return "WRONG_USERNAME"
    end
end

--[[USER CREATE ACCOUNT --]]
local function signup(username,password)
    
    if(string.len(username) < 5) then
        return "SHORT_USERNAME"
    elseif(string.len(password) < 5) then
        return "SHORT_PASSWORD"
    end
    
    local exists = tonumber(redis.call("hget","users:lookup:username",username))
    if (exists == nil) then 
        redis.call("setnx","users:index",0);
        local new_id = redis.call("incr","users:index");
        redis.call("hset","users:lookup:username",username,new_id)
        local userData = {}
        userData["username"] = username
        userData["password"] = password
        redis.call("hset","users","user:"..new_id,cjson.encode(userData))
        return "USER_CREATED"
    else
        return "USERNAME_TAKEN"
    end
end


local funcName = ARGV[1]
--[[SWITCH PARA VER QUE LLAMA --]]
if(funcName == "login()") then
    return login(KEYS[1],KEYS[2])
elseif(funcName == "signup()") then
    return signup(KEYS[1],KEYS[2])
end

