# Todo App

A simple and efficient **To-Do App** built with **React Native** that allows users to add, edit, delete, and undo delete tasks. It also features a **completion progress bar**, **vector icons setup**, and **React Reanimated plugin integration**, with data persistence using **Async Storage**.

---

## Create app (using cli method)
- npx @react-native-community/cli init TestSF

#### Other commands
- adb devices
- adb kill-server
- adb start-server
- adb reverse tcp:8081 tcp:8081
- npx react-native run-android
- npm start -- --reset-cache
- ./gradlew clean
- ./gradlew assembleDebug

## 📌 Features

- ✅ **Add, Edit, Delete, and Undo Delete Tasks**
- 📊 **Task Completion Progress Bar**
- 🎨 **Vector Icons Setup**
- 🔄 **React Reanimated Plugin**
- 💾 **Data Persistence with Async Storage**

---

## 🚀 Getting Started

### 1️⃣ Installation
```sh
# Clone the repository
git clone https://github.com/Saurabh7514/SuffescomTodo.git

# Navigate to the project folder
cd SuffescomTodo

# Install dependencies
npm install
```

### 2️⃣ Run the Application
```sh
# Start the Metro server
npx react-native start

# Run on Android
yarn android

# Run on iOS
npx pod-install && yarn ios
```

---

## 🛠 Challenges & Solutions

### 🔹 **Issue: Data Persistence**
**Challenge:** Storing tasks even after the app is closed.
**Solution:** Implemented **Async Storage** to save and retrieve tasks efficiently.

### 🔹 **Issue: Smooth Animations**
**Challenge:** Ensuring smooth transitions when adding or deleting tasks.
**Solution:** Used **React Reanimated** for better performance.

### 🔹 **Issue: Undo Delete Feature**
**Challenge:** Recovering a deleted task without affecting the existing list.
**Solution:** Implemented a temporary cache and rollback mechanism using **Async Storage**.

### 🔹 **Issue: Vector Icons Not Loading**
**Challenge:** Icons were missing due to incorrect imports.
**Solution:** Properly configured and imported icons from **react-native-vector-icons**.

---

## 🤝 Contributing
Feel free to contribute by submitting issues and pull requests! 😊

---

## 📜 License
This project is licensed under the MIT License.

---

### ✨ **Developed by** [Saurabh Chauhan](https://github.com/Saurabh7514) 🚀

