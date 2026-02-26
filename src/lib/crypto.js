// src/lib/crypto.js
// AES-GCM encryption using the browser-native Web Crypto API.
// No third-party dependency needed.

const rawKey = import.meta.env.VITE_SECRET_ENCRYPTION_KEY || '0000000000000000000000000000000000000000000000000000000000000000';

// Ensure the key is exactly 64 hex chars (32 bytes) for AES-256
function getValidHexKey(hexStr) {
    let sanitized = hexStr.replace(/[^0-9a-fA-F]/g, '');
    if (sanitized.length < 64) {
        sanitized = sanitized.padEnd(64, '0');
    } else if (sanitized.length > 64) {
        sanitized = sanitized.substring(0, 64);
    }
    return sanitized;
}

function hexToBytes(hex) {
    const bytes = new Uint8Array(hex.length / 2);
    for (let i = 0; i < hex.length; i += 2) {
        bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
    }
    return bytes;
}

function bytesToHex(bytes) {
    return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
}

let cryptoKeyPromise = null;

async function getCryptoKey() {
    if (!cryptoKeyPromise) {
        const validKeyHex = getValidHexKey(rawKey);
        cryptoKeyPromise = crypto.subtle.importKey(
            'raw',
            hexToBytes(validKeyHex),
            { name: 'AES-GCM' },
            false,
            ['encrypt', 'decrypt']
        );
    }
    return cryptoKeyPromise;
}

export async function encrypt(plaintext) {
    if (!plaintext) return '';
    const key = await getCryptoKey();
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encoded = new TextEncoder().encode(plaintext);
    const ciphertext = await crypto.subtle.encrypt(
        { name: 'AES-GCM', iv },
        key,
        encoded
    );
    return `${bytesToHex(iv)}:${bytesToHex(new Uint8Array(ciphertext))}`;
}

export async function decrypt(encoded) {
    if (!encoded) return '';

    // Migration: old CryptoJS values won't contain ':'.
    if (!encoded.includes(':')) {
        console.warn('Legacy encrypted value detected (no ":" separator). Returning raw value.');
        return encoded;
    }

    try {
        const [ivHex, ctHex] = encoded.split(':');
        const key = await getCryptoKey();
        const plainBuffer = await crypto.subtle.decrypt(
            { name: 'AES-GCM', iv: hexToBytes(ivHex) },
            key,
            hexToBytes(ctHex)
        );
        return new TextDecoder().decode(plainBuffer);
    } catch (err) {
        console.error('Failed to decrypt value:', err);
        return 'Decryption Error';
    }
}
