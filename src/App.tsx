import React, { useState, ChangeEvent, FormEvent } from 'react'
import { Button } from './componentes/ui/button'
import { Input } from './componentes/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from './componentes/ui/card'
import { Label } from './componentes/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './componentes/ui/tabs'

interface Transacao {
  id: number
  descricao: string
  valor: number
  tipo: 'receita' | 'despesa'
}

const App: React.FC = () => {
  const [transacoes, setTransacoes] = useState<Transacao[]>([])
  const [descricao, setDescricao] = useState('')
  const [valor, setValor] = useState('')
  const [tipo, setTipo] = useState<'receita' | 'despesa'>('receita')

  const adicionarTransacao = (e: FormEvent<HTMLFormElement>) => {
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

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 text-center">Gerenciador de Orçamento Pessoal</h1>
      
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
              <form onSubmit={(e) => { e.preventDefault(); setTipo('receita'); adicionarTransacao(e); }} className="space-y-4">
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
              <form onSubmit={(e) => { e.preventDefault(); setTipo('despesa'); adicionarTransacao(e); }} className="space-y-4">
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
                  R$ {transacao.valor.toFixed(2)}
                </span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}

export default App