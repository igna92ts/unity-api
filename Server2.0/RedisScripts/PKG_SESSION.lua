--[[START SESSIONS USING DEVICEID AS SESSION_ID --]]
local function startSession(deviceId)
    local sessionData = {}
    sessionData["status"] = "true"
    sessionData["username"] = ""
    sessionData["state"] = "login"
    sessionData["current_room"] = ""
    redis.call("hset","sessions",deviceId,cjson.encode(sessionData))
end


--[[DELETE SESSIONS USING DEVICEID AS SESSION_ID --]]
local function killSession(deviceId)
    if(redis.call("hexists","sessions",deviceId) > 0) then
        local sessionData = cjson.decode(redis.call("hget","sessions",deviceId))
        redis.call("hdel","players:"..sessionData["current_room"],deviceId)
        redis.call("hdel","sessions",deviceId)
    end
end

local funcName = ARGV[1]
--[[SWITCH PARA VER QUE LLAMA --]]
if(funcName == "startSession()") then
    return startSession(KEYS[1])
elseif(funcName == "killSession()") then
    return killSession(KEYS[1])
end