export const getFromStorage = function (key) {
    return JSON.parse(localStorage.getItem(key) || "[]");
};

export const addToStorage = function (obj, key) {
    const storageData = getFromStorage(key);
    storageData.push(obj);
    localStorage.setItem(key, JSON.stringify(storageData));
};

export const updateStorage = function (key, obj) {
    localStorage.setItem(key, JSON.stringify(obj));
};

export const generateTestUser = function (User) {
    if (!localStorage.users) {
        const testUser = new User("test", "qwerty123");
        User.save(testUser);

        const testAdmin = new User("admin", "admin123", "admin");
        User.save(testAdmin);
    }
};
