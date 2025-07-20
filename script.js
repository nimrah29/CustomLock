const themes = {
  space: ["Nova", "Star", "Comet", "Galaxy", "Rocket", "Astro", "Orbit", "Venus", "Cosmo", "Lunar"],
  anime: ["Naruto", "Senpai", "Kawaii", "Goku", "Sakura", "Chibi", "Otaku", "Itachi", "Zenitsu", "Luffy"],
  animals: ["Tiger", "Panda", "Falcon", "Neko", "Bunny", "Wolf", "Koala", "Eagle", "Fox", "Bear"],
  food: ["Pizza", "Sushi", "Burger", "Taco", "Noodle", "Cookie", "Mango", "Donut", "Biryani", "Cheese"],
  tech: ["Pixel", "Code", "Crypto", "Binary", "Bug", "Cache", "Server", "Script", "Logic", "Hack"],
  fantasy: ["Dragon", "Elf", "Wizard", "Knight", "Magic", "Phoenix", "Griffin", "Potion", "Rune", "Crown"],
  moods: ["Happy", "Moody", "Cozy", "Chill", "Lively", "Dreamy", "Funky", "Witty", "Bold", "Zesty"],
  bts: ["Jungkook", "Jimin", "V", "RM", "J-Hope", "Jin", "Suga", "Butter", "Dynamite", "Army"]
};

document.addEventListener("DOMContentLoaded", () => {
  // Elements
  const usernameInput = document.getElementById("username");
  const checkPasswordInput = document.getElementById("checkPassword");
  const strengthOutput = document.getElementById("strength-output");

  const themeSelect = document.getElementById("theme");
  const themePreview = document.getElementById("theme-preview");
  const keywordsInput = document.getElementById("keywords");
  const lengthInput = document.getElementById("length");
  const generateBtn = document.getElementById("generateBtn");
  const copyBtn = document.getElementById("copyBtn");
  const generatedPasswordDiv = document.getElementById("generated-password");
  const genPwVisibilityGroup = document.getElementById("genPwVisibilityGroup");
  const generatedPasswordInput = document.getElementById("generatedPasswordInput");
  const toast = document.getElementById("toast");

  // Password check
  function checkStrength() {
    const password = checkPasswordInput.value.trim();
    const username = usernameInput.value.trim().toLowerCase();

    if (!password) {
      strengthOutput.innerText = "Strength: -";
      strengthOutput.style.color = "#333";
      return;
    }

    const pwdLower = password.toLowerCase();

    if (username && pwdLower === username) {
      strengthOutput.innerText = "Strength: Very Weak (same as username)";
      strengthOutput.style.color = "#c0392b";
      return;
    }
    if (username && (pwdLower.includes(username) || pwdLower.startsWith(username))) {
      strengthOutput.innerText = "Strength: Weak (contains username)";
      strengthOutput.style.color = "#c0392b";
      return;
    }

    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;

    // Reward extra for length >=16
    if (password.length >= 16) strength++;

    const status = ["Very Weak", "Weak", "Medium", "Strong", "Very Strong", "Ultra"];
    const colors = ["#c0392b", "#e67e22", "#f1c40f", "#2ecc71", "#27ae60", "#009873"];
    strengthOutput.innerText = `Strength: ${status[strength - 1] || "-"}`;
    strengthOutput.style.color = colors[strength - 1] || "#333";
  }

  checkPasswordInput.addEventListener("input", checkStrength);
  usernameInput.addEventListener("input", checkStrength);

  // Password visibility toggle for checker
  const toggleCheckVisibility = document.getElementById("toggleCheckVisibility");
  toggleCheckVisibility.addEventListener("click", () => {
    const type = checkPasswordInput.getAttribute('type') === "password" ? "text" : "password";
    checkPasswordInput.setAttribute('type', type);
    toggleCheckVisibility.innerText = type === "password" ? "👁️" : "🙈";
  });

  // Theme preview feature
  themeSelect.addEventListener("change", function () {
    const theme = this.value;
    if (theme && themes[theme]) {
      const words = themes[theme].slice(0, 5).join(", ");
      themePreview.innerText = `e.g., ${words}`;
    } else {
      themePreview.innerText = "";
    }
  });

  // Password generator helper functions
  function capitalize(word) {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }
  function getRandomChar() {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*_";
    return chars[Math.floor(Math.random() * chars.length)];
  }

  function parseKeywords(raw) {
    // Split by comma or whitespace, trim, and discard empty
    return raw.split(/[\s,]+/).map(k => k.trim()).filter(Boolean);
  }

  // Password generator
  function generatePersonalPassword() {
    const username = usernameInput.value.trim().toLowerCase();
    const theme = themeSelect.value;
    const keywords = parseKeywords(keywordsInput.value.trim().toLowerCase());
    const length = Math.max(8, Math.min(parseInt(lengthInput.value) || 12, 20));

    let base1 = "";
    let base2 = "";

    if (theme && themes[theme]) {
      const themeWords = themes[theme];
      const keywordWord = keywords.length > 0
        ? capitalize(keywords[Math.floor(Math.random() * keywords.length)])
        : "";
      const themeWord = capitalize(themeWords[Math.floor(Math.random() * themeWords.length)]);
      base1 = themeWord;
      base2 = keywordWord || capitalize(themeWords[Math.floor(Math.random() * themeWords.length)]);
    } else if (keywords.length > 0) {
      // Capitalize all keywords and join
      const keywordString = keywords.map(capitalize).join('');
      base1 = keywordString;
      base2 = '';
    } else {
      base1 = "Fun";
      base2 = "Safe";
    }

    const symbol = "!@#$%&*_".charAt(Math.floor(Math.random() * 8));
    const number = Math.floor(Math.random() * 90 + 10);

    let raw = `${base1}${base2}${symbol}${number}`;

    while (raw.length < length) {
      raw += getRandomChar();
    }
    let password = raw.slice(0, length);

    // Remove username if present
    if (username && password.toLowerCase().includes(username)) {
      password = password.replace(new RegExp(username, 'gi'), '');
      password += getRandomChar();
      password = password.slice(0, length);
    }

    return password;
  }

  // Generator event
  generateBtn.addEventListener("click", () => {
    const password = generatePersonalPassword();

    // Show in a hidden input with visibility toggle, for easy copying/showing
    generatedPasswordInput.value = password;
    generatedPasswordInput.setAttribute('type', 'password');
    genPwVisibilityGroup.style.display = "flex";
    generatedPasswordDiv.innerText = `🔑 Your password:`;
    // Optionally, clear checkPasswordInput or bring this section into focus

    // Set focus for accessibility
    generatedPasswordInput.focus();
  });

  // Copy to clipboard
  copyBtn.addEventListener("click", () => {
    const pw = generatedPasswordInput.value;
    if (!pw) {
      showToast("Nothing to copy!");
      return;
    }
    navigator.clipboard.writeText(pw).then(() => {
      showToast("Password copied! ✅");
    });
  });

  // Password visibility toggle for generator
  const toggleGenVisibility = document.getElementById("toggleGenVisibility");
  toggleGenVisibility.addEventListener("click", () => {
    const type = generatedPasswordInput.getAttribute('type') === "password" ? "text" : "password";
    generatedPasswordInput.setAttribute('type', type);
    toggleGenVisibility.innerText = type === "password" ? "👁️" : "🙈";
  });

  // Accessibility: ENTER key on generated pw input copies
  generatedPasswordInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      copyBtn.click();
    }
  });

  // Simple toast function for non-blocking feedback
  function showToast(msg) {
    toast.innerText = msg;
    toast.className = "toast show";
    setTimeout(() => {
      toast.className = toast.className.replace("show", "");
    }, 1800);
  }

});
