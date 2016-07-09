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
    local result
    playerData = cjson.decode(redis.call("hget","players:" .. roomName,deviceId))
    playerData["largo"] = 1
    playerData["speed"] = 1
    if(playerData["state"] == "invulnerable") then
        playerData["state"] = "vulnerable";
        result = "vulnerable";
    else
        playerData["state"] = "invulnerable";
        result = "invulnerable";
    end
    redis.call("hset","players:"..roomName,deviceId,cjson.encode(playerData));
    return result
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
            
        if(playerData["direction"] == "up" and newDirection ~= "down") then
            playerData["direction"] = newDirection
        elseif(playerData["direction"] == "down" and newDirection ~= "up") then
            playerData["direction"] = newDirection
        elseif(playerData["direction"] == "right" and newDirection ~= "left") then 
            playerData["direction"] = newDirection
        elseif(playerData["direction"] == "left" and newDirection ~= "right") then
            playerData["direction"] = newDirection
        end
        
        redis.call("hset","players:"..sessionData["current_room"],deviceId,cjson.encode(playerData))
    end
end

local function eat(playerName,roomName)
    local deviceId = redis.call("hget","players:" .. roomName .. ":lookup:playerName",playerName)
    if(deviceId) then
        local playerData = {}
        playerData = cjson.decode(redis.call("hget","players:"..roomName,deviceId))
        playerData["largo"] = tonumber(playerData["largo"]) + 1
        playerData["speed"] = tonumber(playerData["speed"]) + 1
        redis.call("hset","players:" .. roomName,deviceId,cjson.encode(playerData))
        return cjson.encode(playerData)
    else
        return "ERROR"
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
elseif(funcName == "eat()") then
    return eat(KEYS[1],KEYS[2])
end