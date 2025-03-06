import crypto from 'crypto';

const SGD_SECRET_KEY_PASSWORD = "SgDPasswordSecretPasswor";
// Funciones de encriptación y desencriptación
function obtieneCipher(paraCifrar: boolean, keyString: string) {
  // Genera el hash SHA-1 de la clave
  const hash = crypto.createHash('sha1');
  hash.update(keyString, 'utf8');
  const keyHash = hash.digest();

  // Toma los primeros 16 bytes para la clave AES-128
  const key = keyHash.slice(0, 16);

  // Configura el algoritmo AES en modo ECB con padding PKCS#7
  const algorithm = 'aes-128-ecb';

  if (paraCifrar) {
      return crypto.createCipheriv(algorithm, key, null);
  } else {
      return crypto.createDecipheriv(algorithm, key, null);
  }
}

export default function descifrar(cifrado: string, key: string = SGD_SECRET_KEY_PASSWORD): string {
  const decipher = obtieneCipher(false, key);
  let sinCifrar = decipher.update(cifrado, 'hex', 'utf8');
  sinCifrar += decipher.final('utf8');
  return sinCifrar;
}