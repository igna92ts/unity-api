local function getPlayers(roomName)
    local flat_map = redis.call('hgetall', "players:"..roomName)
    local result = {}
    --[[for i = 1, #flat_map, 2 do
   --     result[flat_map[i] = flat_map[i + 1]
  --  end]]
    local iterator = 1
    for i = 1,#flat_map do
        if i%2==0 then
            result[iterator] = cjson.decode(flat_map[i])
            iterator = iterator + 1
        end
    end
    return cjson.encode(result)
end

local function changeInvulState(playerName,roomName)
    local deviceId = redis.call("hget","players:" .. roomName .. ":lookup:playerName",playerName)
    local playerData = {}
    playerData = cjson.decode(redis.call("hget","players:" .. roomName,deviceId))
    playerData["state"] = "vulnerable"
    redis.call("hset","players:"..roomName,deviceId,cjson.encode(playerData));
    return "vulnerable"
end

local function movePlayer(playerName,roomName,xPos,yPos)
    local deviceId = redis.call("hget","players:" .. roomName .. ":lookup:playerName",playerName)
    if(deviceId) then
        local playerData = {}
        playerData = cjson.decode(redis.call("hget","players:" .. roomName,deviceId))
        local playerPos = {}
        playerPos["x"] = tonumber(xPos)
        playerPos["y"] = tonumber(yPos)
        playerData["position"] = playerPos
        redis.call("hset","players:"..roomName,deviceId,cjson.encode(playerData));
        return cjson.encode(playerData)
    else
        return "ERROR"
    end
end

local function changeDirection(newDirection,deviceId)
    if(redis.call("hexists","sessions",deviceId) > 0) then
        local sessionData = cjson.decode(redis.call("hget","sessions",deviceId))
        local playerData = cjson.decode(redis.call("hget","players:"..sessionData["current_room"],deviceId))
        playerData["direction"] = newDirection
        redis.call("hset","players:"..sessionData["current_room"],deviceId,cjson.encode(playerData))
    end
end
  

local funcName = ARGV[1]
--[[SWITCH PARA VER QUE LLAMA --]]
if(funcName == "getPlayers()") then
    return getPlayers(KEYS[1])
elseif(funcName == "changeInvulState()") then
    return changeInvulState(KEYS[1],KEYS[2])
elseif(funcName == "movePlayer()") then
    return movePlayer(KEYS[1],KEYS[2],KEYS[3],KEYS[4])
elseif(funcName == "changeDirection()") then
    return changeDirection(KEYS[1],KEYS[2])
end