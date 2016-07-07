--[[START SESSIONS USING DEVICEID AS SESSION_ID --]]
local function addPlayerToRoom(playerName,roomName,deviceId)
    local sessionData = cjson.decode(redis.call("hget","sessions",deviceId))
    sessionData["current_room"] = roomName
    sessionData["state"] = "playing"
    redis.call("hset","sessions",deviceId,cjson.encode(sessionData))
    
    local roomData = {}
    roomData = cjson.decode(redis.call("hget","rooms",roomName))
    roomData["player_count"] = tonumber(roomData["player_count"]) + 1
    redis.call("hset","rooms",roomName,cjson.encode(roomData))
    
    local newPlayer = {}
    newPlayer["playerName"] = playerName
    newPlayer["largo"] = 1
    newPlayer["speed"] = 1
    newPlayer["state"] = "invulnerable"
    newPlayer["color"] = ""
    newPlayer["direction"] = "down"
    local directions = {}
    directions[0] = "down"
    newPlayer["pastDirections"] = directions
    local playerPos = {}
    playerPos["x"] = 0
    playerPos["y"] = 0
    newPlayer["position"] = playerPos
    redis.call("hset","players:" .. roomName,deviceId,cjson.encode(newPlayer))
    redis.call("hset","players:" .. roomName .. ":lookup:playerName",playerName,deviceId)
    return cjson.encode(redis.call("hget","players:" .. roomName,deviceId))
end

local function removePlayerFromRoom(deviceId)
    local sessionData = cjson.decode(redis.call("hget","sessions",deviceId))
    local roomName = sessionData["current_room"]
    sessionData["current_room"] = ""
    sessionData["state"] = "menu"
    redis.call("hset","sessions",deviceId,cjson.encode(sessionData))
    
    local playerData = cjson.decode(redis.call("hget","players:"..roomName,deviceId))
    redis.call("hdel","players:"..roomName,deviceId)
    redis.call("hdel","players:"..roomName..":lookup:playerName",playerData["playerName"])
    local roomData = {}
    roomData = cjson.decode(redis.call("hget","rooms",roomName))
    roomData["player_count"] = tonumber(roomData["player_count"]) - 1
    redis.call("hset","rooms",roomName,cjson.encode(roomData))
    return "OK"
end

local function createRoom(roomName,size,deviceId)
    local roomData = {}
    roomData["room_name"] = roomName
    roomData["size"] = tonumber(size)
    roomData["player_count"] = 0
    roomData["owner_session"] = deviceId
    redis.call("hset","rooms",roomName,cjson.encode(roomData))
    return "OK"
end

local function getRooms()
    local flat_map = redis.call('hgetall', "rooms")
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


local funcName = ARGV[1]
--[[SWITCH PARA VER QUE LLAMA --]]
if(funcName == "createRoom()") then
    return createRoom(KEYS[1],KEYS[2],KEYS[3])
elseif(funcName == "addPlayerToRoom()") then
    return addPlayerToRoom(KEYS[1],KEYS[2],KEYS[3])
elseif(funcName == "getRooms()") then
    return getRooms()
elseif(funcName == "removePlayerFromRoom()") then
    return removePlayerFromRoom(KEYS[1])
end