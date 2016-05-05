--[[START SESSIONS USING DEVICEID AS SESSION_ID --]]
local function addPlayerToRoom(playerName,roomName,deviceId)
    local sessionData = cjson.decode(redis.call("hget","sessions",deviceId))
    sessionData["current_room"] = roomName
    sessionData["state"] = "playing"
    redis.call("hset","sessions",deviceId,cjson.encode(sessionData))
        
    local newPlayer = {}
    newPlayer["playerName"] = playerName
    newPlayer["level"] = 0
    newPlayer["score"] = 0
    newPlayer["speed"] = 10
    newPlayer["state"] = "alive"
    newPlayer["weaponId"] = 1
    newPlayer["spriteImg"] = ""
    local playerPos = {}
    playerPos["x"] = 0
    playerPos["y"] = 0
    newPlayer["position"] = playerPos
    redis.call("hset","players:" .. roomName,deviceId,cjson.encode(newPlayer))
        
    return cjson.encode(redis.call("hget","players:" .. roomName,deviceId))
end

local function createRoom(roomName,size,deviceId)
    local roomData = {}
    roomData["room_name"] = roomName
    roomData["size"] = size
    roomData["player_count"] = 0
    roomData["current_top"] = ""
    roomData["map_id"] = ""
    roomData["owner_session"] = deviceId
    redis.call("hset","rooms",roomName,cjson.encode(roomData))
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
end