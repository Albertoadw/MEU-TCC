import React, { createContext, useContext, useMemo, useState } from 'react';

const CarrinhoContext = createContext(null);

export function CarrinhoProvider({ children }) {
  const [itensCarrinho, setItensCarrinho] = useState([]);

  const adicionarAoCarrinho = (produto) => {
    setItensCarrinho((itensAtuais) => {
      const itemExistente = itensAtuais.find((item) => item.id === produto.id);

      if (itemExistente) {
        return itensAtuais.map((item) =>
          item.id === produto.id ? { ...item, quantidade: item.quantidade + 1 } : item
        );
      }

      return [...itensAtuais, { ...produto, quantidade: 1 }];
    });
  };

  const removerDoCarrinho = (produtoId) => {
    setItensCarrinho((itensAtuais) => itensAtuais.filter((item) => item.id !== produtoId));
  };

  const alterarQuantidade = (produtoId, delta) => {
    setItensCarrinho((itensAtuais) =>
      itensAtuais.flatMap((item) => {
        if (item.id !== produtoId) return [item];

        const novaQuantidade = item.quantidade + delta;
        if (novaQuantidade <= 0) return [];

        return [{ ...item, quantidade: novaQuantidade }];
      })
    );
  };

  const limparCarrinho = () => {
    setItensCarrinho([]);
  };

  const totalItens = itensCarrinho.reduce((acc, item) => acc + item.quantidade, 0);
  const totalCarrinho = itensCarrinho.reduce(
    (acc, item) => acc + Number(item.preco || 0) * item.quantidade,
    0
  );

  const value = useMemo(
    () => ({
      itensCarrinho,
      totalItens,
      totalCarrinho,
      adicionarAoCarrinho,
      removerDoCarrinho,
      alterarQuantidade,
      limparCarrinho,
    }),
    [itensCarrinho, totalItens, totalCarrinho]
  );

  return <CarrinhoContext.Provider value={value}>{children}</CarrinhoContext.Provider>;
}

export function useCarrinho() {
  const context = useContext(CarrinhoContext);

  if (!context) {
    throw new Error('useCarrinho deve ser usado dentro de CarrinhoProvider');
  }

  return context;
}
