const redis = require("redis");
const redisClient = redis.createClient();
const { promisify } = require("util");
const InventoryRepo = require("../models/repositories/inventory.repo");

const pexpireAsync = promisify(redisClient.pExpire).bind(redisClient);
const setnxAsync = promisify(redisClient.setNX).bind(redisClient);
const delAsync = promisify(redisClient.del).bind(redisClient);

const acquireLock = async ({ productId, shopId, cartId, quantity }) => {
  const key = `lock_v1_${productId}`;
  const retryTimes = 10;
  const expireTime = 2000; // 2 seconds to release key

  for (let i = 0; i < retryTimes; i++) {
    // the matter here is the key exists or not, so any value can be passed here
    const result = await setnxAsync(key, "");
    if (result === 1) {
      const isReservation = await InventoryRepo.reserveInventory({
        productId,
        shopId,
        cartId,
        quantity,
      });

      if (isReservation.modifiedCount) {
        await pexpireAsync(key, expireTime);
        return key;
      }

      return null;
    } else {
      // delay for every retry
      await new Promise((resolve) => setTimeout(resolve, 50));
    }
  }

  return null;
};

const releaseLock = async (key) => {
  return await delAsync(key);
};

const RedisService = {
  acquireLock,
  releaseLock,
};

module.exports = RedisService;
