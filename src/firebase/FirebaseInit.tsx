import { useState, useEffect } from 'react'
import { Button } from "../componentes/ui/button"
import { initializeApp } from "firebase/app";
import { getAnalytics, logEvent } from "firebase/analytics";
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDsm10CEvwKR521Kx62Cvc8SwCNkgu_dc8",
  authDomain: "venery-41551.firebaseapp.com",
  projectId: "venery-41551",
  storageBucket: "venery-41551.appspot.com",
  messagingSenderId: "99031240316",
  appId: "1:99031240316:web:21be04958c16fcbfe403f9",
  measurementId: "G-YL2GXTNSSL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);

export function FirebaseInit() {
  const [user, setUser] = useState<any>(null);
  const [documents, setDocuments] = useState<any[]>([]);

  useEffect(() => {
    logEvent(analytics, 'app_initialized');

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        logEvent(analytics, 'login', { method: 'Firebase' });
      }
    });

    const fetchDocuments = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'exemplo'));
        setDocuments(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error("Erro ao buscar documentos:", error);
      }
    };

    fetchDocuments();

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      setUser(null);
      logEvent(analytics, 'logout');
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Firebase Inicializado</h2>
      <p className="mb-2">Projeto ID: {firebaseConfig.projectId}</p>
      <p className="mb-2">Usuário: {user ? user.email : 'Não logado'}</p>
      {user && (
        <Button onClick={handleLogout} className="mb-4">
          Logout
        </Button>
      )}
      <h3 className="text-xl font-semibold mt-4 mb-2">Documentos de Exemplo:</h3>
      {documents.length > 0 ? (
        <ul className="list-disc pl-5">
          {documents.map(doc => (
            <li key={doc.id}>{doc.id}: {JSON.stringify(doc)}</li>
          ))}
        </ul>
      ) : (
        <p>Nenhum documento encontrado.</p>
      )}
    </div>
  );
}

export { app, analytics, db, auth };