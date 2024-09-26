import { initializeApp } from "firebase/app";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getAuth, connectAuthEmulator } from "firebase/auth";

// Configuração do Firebase
// ATENÇÃO: Em um cenário real, estas informações devem ser mantidas em segredo
// e idealmente armazenadas em variáveis de ambiente
const firebaseConfig = {
  apiKey: "AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  authDomain: "seu-projeto.firebaseapp.com",
  projectId: "seu-projeto",
  storageBucket: "seu-projeto.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdefghijklmnopqrstuv"
};

// Inicializa o app Firebase
const app = initializeApp(firebaseConfig);

// Obtém instâncias do Firestore e Authentication
const db = getFirestore(app);
const auth = getAuth(app);

// Conecta aos emuladores se estiver em ambiente de desenvolvimento
if (process.env.NODE_ENV === 'development') {
  // Conecta ao emulador do Firestore
  connectFirestoreEmulator(db, 'localhost', 8080);
  
  // Conecta ao emulador de Authentication
  connectAuthEmulator(auth, 'http://localhost:9099');
  
  console.log("Conectado aos emuladores do Firebase");
}

// Exporta as instâncias de db e auth para uso em outros arquivos
export { db, auth };