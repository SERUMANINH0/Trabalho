import { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged, User, signOut } from 'firebase/auth';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { Button } from "../componentes/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../componentes/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../componentes/ui/tabs"
import { Login } from '../componentes/Login';

interface Documento {
  id: string;
  [key: string]: any;
}

export function StatusFirebase() {
  const [usuario, setUsuario] = useState<User | null>(null);
  const [documentos, setDocumentos] = useState<Documento[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const db = getFirestore();

    const cancelarInscricao = onAuthStateChanged(auth, (usuarioAtual) => {
      setUsuario(usuarioAtual);
      setCarregando(false);
    });

    const buscarDocumentos = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'exemplo'));
        const docs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setDocumentos(docs);
      } catch (erro) {
        console.error("Erro ao buscar documentos:", erro);
      }
    };

    buscarDocumentos();

    return () => cancelarInscricao();
  }, []);

  const handleLogout = async () => {
    const auth = getAuth();
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  if (carregando) {
    return <div className="flex justify-center items-center h-screen">Carregando...</div>;
  }

  return (
    <Card className="w-full max-w-3xl mx-auto mt-8 bg-white shadow-lg rounded-lg overflow-hidden">
      <CardHeader className="bg-gray-50 border-b border-gray-200">
        <CardTitle className="text-2xl font-bold text-gray-800">Firebase Inicializado</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <p className="mb-2 text-gray-600">Projeto ID: <span className="font-semibold">venery-41551</span></p>
        <p className="mb-4 text-gray-600">Usuário: <span className="font-semibold">{usuario ? usuario.email : 'Não logado'}</span></p>
        
        {usuario ? (
          <>
            <Button onClick={handleLogout} className="mb-4 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded">
              Logout
            </Button>
            <h3 className="text-lg font-semibold mb-2 text-gray-800">Documentos de Exemplo:</h3>
            {documentos.length > 0 ? (
              <ul className="list-disc pl-5 mb-4 text-gray-600">
                {documentos.map((doc) => (
                  <li key={doc.id} className="mb-1">{doc.id}: {JSON.stringify(doc)}</li>
                ))}
              </ul>
            ) : (
              <p className="mb-4 text-gray-600">Nenhum documento encontrado.</p>
            )}

            <Tabs defaultValue="visao-geral" className="mt-6">
              <TabsList className="grid w-full grid-cols-3 bg-gray-100 rounded-lg p-1">
                <TabsTrigger value="visao-geral" className="py-2 px-4 text-sm font-medium text-gray-700 rounded-md transition-colors duration-150 ease-in-out hover:bg-white hover:text-gray-900">Visão Geral</TabsTrigger>
                <TabsTrigger value="receitas" className="py-2 px-4 text-sm font-medium text-gray-700 rounded-md transition-colors duration-150 ease-in-out hover:bg-white hover:text-gray-900">Receitas</TabsTrigger>
                <TabsTrigger value="despesas" className="py-2 px-4 text-sm font-medium text-gray-700 rounded-md transition-colors duration-150 ease-in-out hover:bg-white hover:text-gray-900">Despesas</TabsTrigger>
              </TabsList>
              <TabsContent value="visao-geral">
                <Card className="mt-4 bg-white shadow rounded-lg">
                  <CardHeader className="bg-gray-50 border-b border-gray-200">
                    <CardTitle className="text-xl font-semibold text-gray-800">Visão Geral</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    <p className="text-gray-600">Conteúdo da visão geral aqui...</p>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="receitas">
                <Card className="mt-4 bg-white shadow rounded-lg">
                  <CardHeader className="bg-gray-50 border-b border-gray-200">
                    <CardTitle className="text-xl font-semibold text-gray-800">Receitas</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    <p className="text-gray-600">Lista de receitas aqui...</p>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="despesas">
                <Card className="mt-4 bg-white shadow rounded-lg">
                  <CardHeader className="bg-gray-50 border-b border-gray-200">
                    <CardTitle className="text-xl font-semibold text-gray-800">Despesas</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    <p className="text-gray-600">Lista de despesas aqui...</p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </>
        ) : (
          <Login />
        )}
      </CardContent>
    </Card>
  );
}