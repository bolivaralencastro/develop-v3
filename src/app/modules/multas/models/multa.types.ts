export type MultaSituacao = 'IMPOSTO' | 'NOTIFICADO' | 'PAGO' | 'RECURSO';

export type MultaDto = {
  id: string;
  placa: string;
  renavam: string;
  chassi: string;
  estado: string;
  numeroMulta: string;
  situacao: MultaSituacao;
  dataInfracao: string;
  horaInfracao: string;
  orgaoAutuador: string;
  codigoInfracao: string;
  descricaoInfracao: string;
  localInfracao: string;
  valor: string;
};

export type MultaFilter = {
  tipo?: 'IMPOSTAS' | 'NOTIFICADAS' | 'TODAS';
  search?: string;
  estado?: string[];
  page?: number;
  limit?: number;
};

// Resumo de multas por veículo (planilhas MENU CONSULTAS 1.10.x e MENU VEÍCULOS 2.6)
export type MultaResumoDto = {
  id: string;
  placa: string;
  renavam: string;
  chassi: string;
  estado: string;
  quantidadeImpostas: number;
  valorImpostas: string;
  quantidadeNotificadas: number;
  valorNotificadas: string;
  quantidadeTotal: number;
  valorTotal: string;
};

function parseValor(valor: string): number {
  return Number(valor.replace(/[^\d,.-]/g, '').replace(/\./g, '').replace(',', '.')) || 0;
}

function formatValor(valor: number): string {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export function groupMultasByVeiculo(multas: MultaDto[]): MultaResumoDto[] {
  const byPlaca = new Map<string, MultaDto[]>();
  for (const m of multas) {
    const group = byPlaca.get(m.placa) ?? [];
    group.push(m);
    byPlaca.set(m.placa, group);
  }

  return Array.from(byPlaca.values()).map((group) => {
    const impostas = group.filter((m) => m.situacao === 'IMPOSTO');
    const notificadas = group.filter((m) => m.situacao === 'NOTIFICADO');
    const valorImpostas = impostas.reduce((sum, m) => sum + parseValor(m.valor), 0);
    const valorNotificadas = notificadas.reduce((sum, m) => sum + parseValor(m.valor), 0);
    const first = group[0];
    return {
      id: first.placa,
      placa: first.placa,
      renavam: first.renavam,
      chassi: first.chassi,
      estado: first.estado,
      quantidadeImpostas: impostas.length,
      valorImpostas: formatValor(valorImpostas),
      quantidadeNotificadas: notificadas.length,
      valorNotificadas: formatValor(valorNotificadas),
      quantidadeTotal: impostas.length + notificadas.length,
      valorTotal: formatValor(valorImpostas + valorNotificadas),
    };
  });
}
