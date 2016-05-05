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


local funcName = ARGV[1]
--[[SWITCH PARA VER QUE LLAMA --]]
if(funcName == "getPlayers()") then
    return getPlayers(KEYS[1])
end