const argon2 = require('argon2')

// Generates a HASH for encryption security
async function generate(value) {
    return await argon2.hash(value, {
        type: argon2.argon2id,
         // Determinate the cost of memory for create each hash. More memory = More safe
        memoryCost: 32768, // 32 MB
        // How much times repeats the hashing process
        timeCost: 3, // Repeats the hashing process 3 times on the same memory
        // How much threads of the CPU will use the hash
        parallelism: 1, // Only 1 thread
        // Aleatory value added to the original value
        saltLength: 16, // 16 aleatory characters added to the value
        // Length of the final hash
        hashLength: 32 // Hash generated of 32 characters
    });
}

// Validate a original hash with another raw date, regenerating the hash
async function validate(original, newValue) {
    return await argon2.verify(original, newValue)
}

module.exports = { generate, validate }