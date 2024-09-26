import { useState, useEffect, ChangeEvent, FormEvent } from 'react'
import { getAuth, onAuthStateChanged, User, signOut } from 'firebase/auth';
import { Button } from "./componentes/ui/button"
import { Input } from "./componentes/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "./componentes/ui/card"
import { Label } from "./componentes/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./componentes/ui/tabs"
import { FirebaseInit } from './firebase/FirebaseInit'
import { Login } from './componentes/Login'

interface Transacao {
  id: number
  descricao: string
  valor: number
  tipo: 'receita' | 'despesa'
}

const App = () => {
  const [transacoes, setTransacoes] = useState<Transacao[]>([])
  const [descricao, setDescricao] = useState('')
  const [valor, setValor] = useState('')
  const [usuario, setUsuario] = useState<User | null>(null)
  const [carregando, setCarregando] = useState(true)
  const [mensagem, setMensagem] = useState('')
  const [mostrarLogin, setMostrarLogin] = useState(true)

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (usuarioAtual) => {
      setUsuario(usuarioAtual);
      setCarregando(false);
      if (usuarioAtual) {
        setMensagem(`Login bem-sucedido: ${usuarioAtual.email}`);
        setMostrarLogin(false);
      } else {
        setMensagem('');
      }
    });

    return () => unsubscribe();
  }, []);

  const adicionarTransacao = (e: FormEvent<HTMLFormElement>, tipo: 'receita' | 'despesa') => {
    e.preventDefault()
    if (descricao && valor) {
      const novaTransacao: Transacao = {
        id: Date.now(),
        descricao,
        valor: parseFloat(valor),
        tipo
      }
      setTransacoes([...transacoes, novaTransacao])
      setDescricao('')
      setValor('')
    }
  }

  const calcularSaldo = () => {
    return transacoes.reduce((total, transacao) => {
      return transacao.tipo === 'receita'
        ? total + transacao.valor
        : total - transacao.valor
    }, 0)
  }

  const handleDescricaoChange = (e: ChangeEvent<HTMLInputElement>) => setDescricao(e.target.value)
  const handleValorChange = (e: ChangeEvent<HTMLInputElement>) => setValor(e.target.value)

  const handleLogout = async () => {
    const auth = getAuth();
    try {
      await signOut(auth);
      setMensagem('Logout realizado com sucesso');
      setMostrarLogin(true);
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      setMensagem('Erro ao fazer logout');
    }
  }

  const handleEntrarSemLogin = () => {
    setMostrarLogin(false);
    setMensagem('Você entrou sem fazer login');
  }

  if (carregando) {
    return <div className="flex justify-center items-center h-screen">Carregando...</div>;
  }

  const conteudoPrincipal = (
    <>
      <Tabs defaultValue="visao-geral" className="mb-8">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="visao-geral">Visão Geral</TabsTrigger>
          <TabsTrigger value="receitas">Receitas</TabsTrigger>
          <TabsTrigger value="despesas">Despesas</TabsTrigger>
        </TabsList>
        <TabsContent value="visao-geral">
          <Card>
            <CardHeader>
              <CardTitle>Resumo Financeiro</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-2xl font-semibold">Saldo Atual: R$ {calcularSaldo().toFixed(2)}</p>
                <p className="text-xl">Saldo Inteiro: R$ {Math.floor(calcularSaldo())}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="receitas">
          <Card>
            <CardHeader>
              <CardTitle>Adicionar Receita</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={(e) => adicionarTransacao(e, 'receita')} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="receita-descricao">Descrição</Label>
                  <Input
                    id="receita-descricao"
                    value={descricao}
                    onChange={handleDescricaoChange}
                    placeholder="Ex: Salário, Freelance, etc."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="receita-valor">Valor (R$)</Label>
                  <Input
                    id="receita-valor"
                    type="number"
                    value={valor}
                    onChange={handleValorChange}
                    placeholder="0.00"
                    step="0.01"
                  />
                </div>
                <Button type="submit" className="w-full">Adicionar Receita</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="despesas">
          <Card>
            <CardHeader>
              <CardTitle>Adicionar Despesa</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={(e) => adicionarTransacao(e, 'despesa')} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="despesa-descricao">Descrição</Label>
                  <Input
                    id="despesa-descricao"
                    value={descricao}
                    onChange={handleDescricaoChange}
                    placeholder="Ex: Aluguel, Supermercado, etc."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="despesa-valor">Valor (R$)</Label>
                  <Input
                    id="despesa-valor"
                    type="number"
                    value={valor}
                    onChange={handleValorChange}
                    placeholder="0.00"
                    step="0.01"
                  />
                </div>
                <Button type="submit" className="w-full">Adicionar Despesa</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Transações Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {transacoes.map((transacao) => (
              <li key={transacao.id} className="flex justify-between items-center p-2 bg-gray-100 rounded">
                <span>{transacao.descricao}</span>
                <span className={transacao.tipo === 'receita' ? 'text-green-600' : 'text-red-600'}>
                  {transacao.tipo === 'receita' ? '+' : '-'} R$ {transacao.valor.toFixed(2)}
                </span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </>
  )

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 text-center">Gerenciador de Orçamento Pessoal</h1>
      
      <FirebaseInit />
      
      {mensagem && (
        <div className="mb-4 p-2 bg-green-100 text-green-700 rounded">
          {mensagem}
        </div>
      )}

      <div className="mb-4 flex justify-between items-center">
        {usuario ? (
          <>
            <p className="text-gray-600">Usuário: <span className="font-semibold">{usuario.email}</span></p>
            <Button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white">
              Logout
            </Button>
          </>
        ) : (
          <>
            <p className="text-gray-600">Usuário: <span className="font-semibold">Não logado</span></p>
            <Button onClick={() => setMostrarLogin(true)} className="bg-blue-500 hover:bg-blue-600 text-white">
              Login
            </Button>
          </>
        )}
      </div>

      {mostrarLogin ? (
        <Card className="w-full max-w-md mx-auto mt-8">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Login</CardTitle>
          </CardHeader>
          <CardContent>
            <Login />
            <Button
              onClick={handleEntrarSemLogin}
              className="w-full mt-4 bg-gray-500 hover:bg-gray-600 text-white"
            >
              Entrar sem fazer login
            </Button>
          </CardContent>
        </Card>
      ) : (
        conteudoPrincipal
      )}
    </div>
  )
}

export default App