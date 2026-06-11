# 🦛 Hippo Messenger

<!-- <p align="center">
  <img src="assets/logo.png" width="160" alt="Hippo Messenger Logo"/>
</p> -->

<h3 align="center">
A modern real-time messaging app built with React Native & Firebase
</h3>

<p align="center">
  Fast • Secure • Real-time • Production-ready architecture
</p>


<p align="center">

![React Native](https://img.shields.io/badge/React%20Native-0.81-blue?style=for-the-badge&logo=react)

![Firebase](https://img.shields.io/badge/Firebase-Realtime-orange?style=for-the-badge&logo=firebase)

![TypeScript](https://img.shields.io/badge/TypeScript-Enabled-blue?style=for-the-badge&logo=typescript)

![Android](https://img.shields.io/badge/Android-Supported-green?style=for-the-badge&logo=android)

</p>


# 📱 About Hippo Messenger

Hippo Messenger is a modern one-to-one real-time messaging application built using React Native and Firebase.

The goal of Hippo Messenger is to provide a smooth, reliable, and scalable chat experience with a clean architecture that can grow into a complete social communication platform.

Currently the app focuses on:

- Real-time one-to-one messaging
- Google authentication
- User profiles
- Online presence
- Typing indicators
- Chat rooms
- Profile image uploads


---

# ✨ Features


## 🔐 Authentication

- Google Sign-In integration
- Firebase Authentication
- Secure user session handling
- Automatic login persistence


## 💬 Real-Time Messaging

- One-to-one chat
- Instant message synchronization
- Firebase Realtime Database
- Message ordering
- Message validation
- Optimized chat structure


## 👤 User Profiles

- Custom profile name
- Profile photo upload
- Firebase Storage integration
- Profile sync across chats
- Real-time profile updates


## 🟢 Online Presence

- Online/offline status
- Last seen timestamp
- Real-time presence tracking


## ✍️ Typing Indicator

- Live typing status
- Debounced typing events
- Automatic typing timeout cleanup


## 📩 Chat Experience

- Recent conversations
- Last message preview
- Unread message counter
- Chat room based architecture


---

# 🏗️ Tech Stack


## Frontend

- React Native
- TypeScript
- React Navigation


## Backend

Firebase:

- Firebase Authentication
- Firebase Realtime Database
- Firebase Storage
- Firebase Cloud Messaging (planned)


---

# 📂 Project Structure


```

src
│
├── components
│   ├── Avatar.tsx
│   ├── ChatBubble.tsx
│   └── EmptyState.tsx
│
├── screens
│   ├── LoginScreen.tsx
│   ├── ChatsScreen.tsx
│   ├── ChatScreen.tsx
│   ├── UsersScreen.tsx
│   ├── ProfileScreen.tsx
│   └── EditProfileScreen.tsx
│
├── services
│   ├── authService.ts
│   ├── chatService.ts
│   ├── storageService.ts
│   └── profileSyncService.ts
│
├── navigation
│   ├── RootNavigator.tsx
│   ├── MainTabs.tsx
│   └── types.ts
│
├── hooks
│
├── utils
│
└── constants

```


---

# 🔥 Firebase Security

The project uses Firebase security rules to ensure:

- Only authenticated users can access data
- Users can update only their own profile
- Chat members can access their conversations
- Messages can only be sent by valid participants


---

# 🚀 Installation


Clone repository


```bash
git clone https://github.com/yourusername/hippo-messenger.git
````

Install dependencies

```bash
npm install
```

Install Android dependencies

```bash
cd android

./gradlew clean
```

Run app

```bash
npx react-native run-android
```

---

# ⚙️ Firebase Setup

Create Firebase project:

1. Enable Authentication
2. Enable Google Sign-In
3. Enable Realtime Database
4. Enable Storage

Add:

```
google-services.json
```

inside:

```
android/app/
```

Configure:

```
GOOGLE_WEB_CLIENT_ID
```

inside:

```
src/config/google.ts
```

---

# 🛣️ Roadmap

## Phase 1 ✅

* Google Authentication
* One-to-one messaging
* Firebase Realtime Database
* Basic chat UI

## Phase 2 ✅

* Profile images
* Typing indicator
* Unread messages
* Recent chats

## Phase 3 🔜

* Push notifications
* Message read receipts
* Image messages
* Voice messages
* Message reactions
* Reply messages

## Phase 4 🔮

* Group chats
* Stories
* Communities
* Advanced privacy settings

---

# 📸 Screenshots

<p align="center">
  <table>
    <tr>
      <td align="center">
        <b>Login Screen</b><br><br>
        <img src="screenshots/Screenshot_1780912370.png" width="110%" alt="Hippo Messenger Login Screen"/>
      </td>
      <td align="center">
        <b>Chat List</b><br><br>
        <img src="screenshots/Screenshot_1781094296.png" width="110%" alt="Hippo Messenger Chat List"/>
      </td>
      <td align="center">
        <b>Chat Screen</b><br><br>
        <img src="screenshots/Screenshot_1781094331.png" width="110%" alt="Hippo Messenger Chat Screen"/>
      </td>
    </tr>
  </table>
</p>

---

# 🤝 Contributing

Contributions are welcome.

Feel free to open issues or submit pull requests.

---

# 📄 License

MIT License

---

<p align="center">
Built with ❤️ using React Native and Firebase
</p>

