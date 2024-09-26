import { db, auth } from './firebase';
import { collection, addDoc, DocumentReference } from 'firebase/firestore';
import { createUserWithEmailAndPassword, UserCredential } from 'firebase/auth';

interface User {
  name: string;
  email: string;
}

// Exemplo de uso do Firestore
const addData = async (userData: User): Promise<string | null> => {
  try {
    const docRef: DocumentReference = await addDoc(collection(db, "users"), userData);
    console.log("Documento escrito com ID: ", docRef.id);
    return docRef.id;
  } catch (e) {
    console.error("Erro ao adicionar documento: ", e);
    return null;
  }
};

// Função para validar email
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

// Exemplo de uso do Authentication
const signUp = async (email: string, password: string): Promise<UserCredential | null> => {
  if (!isValidEmail(email)) {
    console.error("Formato de e-mail inválido");
    return null;
  }

  if (password.length < 6) {
    console.error("A senha deve ter pelo menos 6 caracteres");
    return null;
  }

  try {
    const userCredential: UserCredential = await createUserWithEmailAndPassword(auth, email, password);
    console.log("Usuário registrado: ", userCredential.user);
    return userCredential;
  } catch (error) {
    console.error("Erro ao registrar usuário: ", error);
    return null;
  }
};

// Exemplo de uso
const exampleUsage = async () => {
  const newUser: User = {
    name: "venery",
    email: "veneryportorufino@gmail.com"
  };

  const docId = await addData(newUser);
  if (docId) {
    console.log(`Usuário adicionado com ID: ${docId}`);
  } else {
    console.error("Falha ao adicionar usuário");
  }

  const userCredential = await signUp("veneryportorufino@gmail.com", "Celio321");
  if (userCredential) {
    console.log(`Novo usuário criado com ID: ${userCredential.user.uid}`);
  } else {
    console.error("Falha ao criar novo usuário");
  }
};

exampleUsage();

export { addData, signUp, isValidEmail };