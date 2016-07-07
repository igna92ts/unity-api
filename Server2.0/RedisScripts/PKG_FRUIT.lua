local function spawnFruit(roomName,randomSeed)
    local fruit = {}
    local fruitPos = {}
    math.randomseed(randomSeed)
    fruitPos["x"] = math.random(0,40)
    fruitPos["y"] = math.random(0,80)
    fruit["position"] = fruitPos
    redis.call("hset","fruits",roomName,cjson.encode(fruit))
    return cjson.encode(fruit)
end

local function getFruit(roomName)
    return redis.call("hget","fruits",roomName)
end


local funcName = ARGV[1]
if(funcName == "spawnFruit()") then
    return spawnFruit(KEYS[1],KEYS[2])
elseif(funcName == "getFruit()") then
    return getFruit(KEYS[1])
end