const factorials = Array(13).fill(1); 

function initializeFactorials() {
    for (let i = 1; i <= 12; ++i) {
        factorials[i] = factorials[i - 1] * i;
    }
}

function countPermutations(freq) {
    let sum = freq.reduce((acc, val) => acc + val, 0);
    let denom = 1;
    for (let f of freq) {
        denom *= factorials[f];
    }
    return factorials[sum] / denom;
}

function nthPermutation(s, n) {
    let freq = Array(256).fill(0);
    for (let c of s) ++freq[c.charCodeAt(0)];

    let remaining = s.length;
    let result = '';
    while (remaining--) {
        for (let c = 0; c < 256; ++c) {
            if (!freq[c]) continue;
            --freq[c];
            let cnt = countPermutations(freq);
            if (n <= cnt) { 
                result += String.fromCharCode(c); 
                break;
            }
            n -= cnt;
            ++freq[c];
        }
    }
    return result;
}

function permutationRank(s) {
    let freq = Array(256).fill(0);
    for (let c of s) ++freq[c.charCodeAt(0)];

    let rank = 1;
    for (let i = 0; i < s.length; ++i) {
        for (let c = 0; c < s[i].charCodeAt(0); ++c) {
            if (!freq[c]) continue;
            --freq[c]; rank += countPermutations(freq); ++freq[c];
        }
        --freq[s[i].charCodeAt(0)];
    }
    return rank;
}

function totalPermutations(s) {
    let freq = Array(256).fill(0);
    for (let c of s) ++freq[c.charCodeAt(0)];

    let num = factorials[s.length];
    let denom = 1;
    for (let f of freq) denom *= factorials[f];
    return num / denom;
}

function transformEncrypt(s) {
    const n = s.length;
    let out = '';
    for (let i = 0; i < n; ++i) {
        const coeff = (3 * i ** 3 + i ** 2 + 4 * i + 1) % 256;
        out += String.fromCharCode((coeff * s.charCodeAt(i)) % 256);
    }
    return out;
}

function transformDecrypt(s) {
    const n = s.length;
    let out = '';
    for (let i = 0; i < n; ++i) {
        const coeff = (3 * i ** 3 + i ** 2 + 4 * i + 1) % 256;
        let inv = 1;
        while ((inv * coeff) % 256 !== 1) {
            ++inv;
        }
        out += String.fromCharCode((inv * s.charCodeAt(i)) % 256);
    }
    return out;
}

function encrypt(input) {
    const n = input.length;
    initializeFactorials();
    let left = '', middle = '', right = '';
    
    for (let i = 0; i < n; ++i) {
        if (i % 3 === 0) left += input[i];
        else if (i % 3 === 1) middle += input[i];
        else right += input[i];
    }

    const totLeft = totalPermutations(left), rkLeft = permutationRank(left);
    const encLeft = transformEncrypt(nthPermutation(left, totLeft - rkLeft + 1));

    const totMiddle = totalPermutations(middle), rkMiddle = permutationRank(middle);
    const encMiddle = transformEncrypt(nthPermutation(middle, totMiddle - rkMiddle + 1));

    const totRight = totalPermutations(right), rkRight = permutationRank(right);
    const encRight = transformEncrypt(nthPermutation(right, totRight - rkRight + 1));

    switch (n % 6) {
        case 0: return encLeft + encMiddle + encRight;
        case 1: return encLeft + encRight + encMiddle;
        case 2: return encMiddle + encLeft + encRight;
        case 3: return encMiddle + encRight + encLeft;
        case 4: return encRight + encLeft + encMiddle;
        default: return encRight + encMiddle + encLeft;
    }
}

function decrypt(cipher) {
    const n = cipher.length;
    initializeFactorials();
    const lenL = Math.floor((n + 2) / 3);
    const lenM = Math.floor((n + 1) / 3);
    const lenR = Math.floor(n / 3);

    let left, middle, right;
    switch (n % 6) {
        case 0:
            left = cipher.slice(0, lenL);
            middle = cipher.slice(lenL, lenL + lenM);
            right = cipher.slice(lenL + lenM);
            break;
        case 1:
            left = cipher.slice(0, lenL);
            right = cipher.slice(lenL, lenL + lenR);
            middle = cipher.slice(lenL + lenR);
            break;
        case 2:
            middle = cipher.slice(0, lenM);
            left = cipher.slice(lenM, lenM + lenL);
            right = cipher.slice(lenM + lenL);
            break;
        case 3:
            middle = cipher.slice(0, lenM);
            right = cipher.slice(lenM, lenM + lenR);
            left = cipher.slice(lenM + lenR);
            break;
        case 4:
            right = cipher.slice(0, lenR);
            left = cipher.slice(lenR, lenR + lenL);
            middle = cipher.slice(lenR + lenL);
            break;
        default:
            right = cipher.slice(0, lenR);
            middle = cipher.slice(lenR, lenR + lenM);
            left = cipher.slice(lenR + lenM);
            break;
    }

    const tmpLeft = transformDecrypt(left);
    const tmpMiddle = transformDecrypt(middle);
    const tmpRight = transformDecrypt(right);

    const totLeft = totalPermutations(tmpLeft), rkLeft = permutationRank(tmpLeft);
    const origLeft = nthPermutation(tmpLeft, totLeft - rkLeft + 1);

    const totMiddle = totalPermutations(tmpMiddle), rkMiddle = permutationRank(tmpMiddle);
    const origMiddle = nthPermutation(tmpMiddle, totMiddle - rkMiddle + 1);

    const totRight = totalPermutations(tmpRight), rkRight = permutationRank(tmpRight);
    const origRight = nthPermutation(tmpRight, totRight - rkRight + 1);

    let result = '';
    let iL = 0, iM = 0, iR = 0;
    for (let i = 0; i < n; ++i) {
        if (i % 3 === 0) result += origLeft[iL++];
        else if (i % 3 === 1) result += origMiddle[iM++];
        else result += origRight[iR++];
    }
    return result;
}

export { encrypt, decrypt };
