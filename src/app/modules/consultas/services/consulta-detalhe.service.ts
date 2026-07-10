import { computed, Injectable, signal } from '@angular/core';
import { PageMeta } from '@core/http';
import { ConsultaDetalheDto, ConsultaDetalheFilter, ConsultaDetalheType } from '../models/consulta.types';

// Dados reais extraídos das planilhas "MENU CONSULTAS - REVISADO 07.07" enviadas pelo CEO.
// Cada tipo de consulta tem seu próprio conjunto de veículos (não é a mesma frota em todas as telas).
const MOCK: Record<ConsultaDetalheType, ConsultaDetalheDto[]> = {
  SITUACAO_VEICULO: [
    { id: '1', placa: 'RHJ7A52', renavam: '1274610610', chassi: '9BGKD48U0MB247411', estado: 'PR', status: 'BLOQUEADO', descricaoSituacao: 'BAIXADO' },
    { id: '2', placa: 'TAP0E75', renavam: '1413687935', chassi: '9BWAH5BZ6ST629713', estado: 'PR', status: 'BLOQUEADO', descricaoSituacao: 'BAIXADO' },
    { id: '3', placa: 'TEU5C01', renavam: '1446025184', chassi: '9886111LHTK674832', estado: 'MG', status: 'BLOQUEADO', descricaoSituacao: 'BENEFICIO DE ICMS' },
    { id: '4', placa: 'TWZ2I50', renavam: '1450664536', chassi: '9BD341ATWTYA60740', estado: 'MG', status: 'BLOQUEADO', descricaoSituacao: 'BENEFICIO DE ICMS' },
    { id: '5', placa: 'TWY0D34', renavam: '1449982627', chassi: '9BD341AGWTYA58119', estado: 'MG', status: 'BLOQUEADO', descricaoSituacao: 'BENEFICIO DE ICMS IMPEDIMENTO ADM.DANO GRANDE MONTA' },
    { id: '6', placa: 'TEN9B43', renavam: '1442003828', chassi: '9BD341ACWSYA46409', estado: 'MG', status: 'BLOQUEADO', descricaoSituacao: 'BENEFICIO DE ICMS IMPEDIMENTO ADM.DANO GRANDE MONTA' },
    { id: '7', placa: 'TXH7H01', renavam: '1461824785', chassi: '9BGEN48H0TG145081', estado: 'MG', status: 'BLOQUEADO', descricaoSituacao: 'BENEFICIO DE ICMS IMPEDIMENTO ADM.DANO MEDIA MONTA' },
    { id: '8', placa: 'TEN7D39', renavam: '1441881759', chassi: '9BHCP41EBTP745958', estado: 'MG', status: 'BLOQUEADO', descricaoSituacao: 'BENEFICIO DE ICMS IMPEDIMENTO ADM.DANO MEDIA MONTA' },
    { id: '9', placa: 'STF4B83', renavam: '1377128170', chassi: '9BWAG5R19RT036067', estado: 'SP', status: 'BLOQUEADO', descricaoSituacao: 'BLOQUEIO POR INDISPONIBILIDADE ADMINISTRATIVA' },
    { id: '10', placa: 'TCE6I85', renavam: '1401570892', chassi: '9BGEA48A0SG130296', estado: 'MG', status: 'LIBERADO', descricaoSituacao: 'VEÍCULO COM IMPEDIMENTO PROPRIEDADE LOCADORA' },
    { id: '11', placa: 'PVR5I69', renavam: '1390119928', chassi: '9BGEA48A0SG121269', estado: 'MG', status: 'LIBERADO', descricaoSituacao: 'VEÍCULO COM IMPEDIMENTO PROPRIEDADE LOCADORA' },
    { id: '12', placa: 'RHZ5I04', renavam: '1300031910', chassi: '9BGEB69A0PG125085', estado: 'PR', status: 'LIBERADO', descricaoSituacao: 'VIGENTE (EM CIRCULAÇÃO)' },
    { id: '13', placa: 'SDQ5H25', renavam: '1303505913', chassi: '9BWAG45U5PT024828', estado: 'PR', status: 'LIBERADO', descricaoSituacao: 'VIGENTE (EM CIRCULAÇÃO)' },
    { id: '14', placa: 'SDQ8G10', renavam: '1303933338', chassi: '9BWAG45U4PT034511', estado: 'PR', status: 'LIBERADO', descricaoSituacao: 'VIGENTE (EM CIRCULAÇÃO)' },
  ],
  RECALL: [
    { id: '1', placa: 'RUO7A43', renavam: '1303556844', chassi: '8AP359AFDNU217106', estado: 'MG', status: 'BLOQUEADO', recall: '8AP2022017-8498 RECALL TUBULACAO DE COMBUSTIVEL, SERVICO GRATUITO CASO JA TENHA REALIZADO O RECALL FAVOR DESCONSIDERAR ESTA MENSAGEM', descricaoRecall: 'SEU VEICULO ESTA BLOQUEADO PARA LICENCIAMENTO ANUAL, DEVIDO PENDENCIA DE REALIZACAO DE RECALL, CONFORME CODIGO BRASILEIRO DE TRANSITO. CONTATE SUA CONCESSIONARIA FIAT PARA AGENDAMENTO E REALIZACAO GRATUITA DOS SERVICOS NECESSARIOS', dataRegistroRecall: '10/12/2022', dataLimiteRecall: '10/12/2023', situacaoRecall: 'VENCIDO' },
    { id: '2', placa: 'RUA9A09', renavam: '1295518349', chassi: '9BD358AFNNYM01520', estado: 'MG', status: 'BLOQUEADO', recall: '9BD2022016-8498 RECALL TUBULACAO DE COMBUSTIVEL, SERVICO GRATUITO CASO JA TENHA REALIZADO O RECALL FAVOR DESCONSIDERAR ESTA MENSAGEM', descricaoRecall: 'SEU VEICULO ESTA BLOQUEADO PARA LICENCIAMENTO ANUAL, DEVIDO PENDENCIA DE REALIZACAO DE RECALL, CONFORME CODIGO BRASILEIRO DE TRANSITO. CONTATE SUA CONCESSIONARIA FIAT PARA AGENDAMENTO E REALIZACAO GRATUITA DOS SERVICOS NECESSARIOS', dataRegistroRecall: '13/12/2022', dataLimiteRecall: '13/12/2023', situacaoRecall: 'VENCIDO' },
    { id: '3', placa: 'TDF1J80', renavam: '1417983610', chassi: '9BD281AJHSYG48999', estado: 'MG', status: 'ALERTA', recall: '9BD2025002-8850 VERIFICACAO E SE NECESSARIO A SUBSTITUICAO DO PEDAL DO ACELERADOR.', descricaoRecall: 'POSSIBILIDADE DE MAU CONTATO DO CONECTOR ELETRICO DO PEDAL ACELERADOR QUE PODERA OCASIONAR A PERDA DA ACELERACAO COM VEICULO EM MOVIMENTO, PODENDO OCORRER ACIDENTES COM DANOS MATERIAIS, FISICOS OU ATE MESMO FATAIS AOS OCUPANTES DO VEICULO E OU TERCEIROS', dataRegistroRecall: '14/04/2025', dataLimiteRecall: '14/04/2026', situacaoRecall: 'ATE 4 MESES' },
    { id: '4', placa: 'EHE9C86', renavam: '1337233320', chassi: '9BWAH5BZ3PT605148', estado: 'SP', status: 'ALERTA', recall: '9BD2025002-8850 VERIFICACAO E SE NECESSARIO A SUBSTITUICAO DO PEDAL DO ACELERADOR.', descricaoRecall: 'POSSIBILIDADE DE MAU CONTATO DO CONECTOR ELETRICO DO PEDAL ACELERADOR QUE PODERA OCASIONAR A PERDA DA ACELERACAO COM VEICULO EM MOVIMENTO, PODENDO OCORRER ACIDENTES COM DANOS MATERIAIS, FISICOS OU ATE MESMO FATAIS AOS OCUPANTES DO VEICULO E OU TERCEIROS', dataRegistroRecall: '14/04/2025', dataLimiteRecall: '14/04/2026', situacaoRecall: 'ATE 4 MESES' },
    { id: '5', placa: 'SDT6I30', renavam: '1318572280', chassi: '93YRBB002PJ360128', estado: 'PR', status: 'ALERTA', recall: '93Y2025009-0EHN', descricaoRecall: 'Suporte do eixo traseiro', dataRegistroRecall: '08/09/2025', dataLimiteRecall: '08/09/2026', situacaoRecall: 'MAIS DE 4 MESES' },
    { id: '6', placa: 'SDU4J72', renavam: '1319711690', chassi: '93YRBB001PJ354689', estado: 'PR', status: 'ALERTA', recall: '93Y2025009-0EHN', descricaoRecall: 'Suporte do eixo traseiro', dataRegistroRecall: '08/09/2025', dataLimiteRecall: '08/09/2026', situacaoRecall: 'MAIS DE 4 MESES' },
    { id: '7', placa: 'FCE5F62', renavam: '1390663121', chassi: '9BWBH6BF3R4078287', estado: 'SP', status: 'LIBERADO', recall: 'N/C', descricaoRecall: 'N/C', dataRegistroRecall: 'N/C', dataLimiteRecall: 'N/C', situacaoRecall: 'N/C' },
    { id: '8', placa: 'RHW8G96', renavam: '1295265009', chassi: '9BGEA69H0NG204865', estado: 'PR', status: 'LIBERADO', recall: 'N/C', descricaoRecall: 'N/C', dataRegistroRecall: 'N/C', dataLimiteRecall: 'N/C', situacaoRecall: 'N/C' },
    { id: '9', placa: 'STX9J51', renavam: '1384703109', chassi: '9BWCH6CH1RP050068', estado: 'SP', status: 'LIBERADO', recall: 'N/C', descricaoRecall: 'N/C', dataRegistroRecall: 'N/C', dataLimiteRecall: 'N/C', situacaoRecall: 'N/C' },
  ],
  GNV: [
    { id: '1', placa: 'SEG6A92', renavam: '1342955312', chassi: '9BM958471PB314037', estado: 'PR', status: 'BLOQUEADO', ultimoLaudoGnv: '28/08/2024', prazoRegularizacaoGnv: '28/08/2025', situacaoGnv: 'VENCIDO' },
    { id: '2', placa: 'SEO2G15', renavam: '1352105834', chassi: '93ZS62VTZP8841041', estado: 'PR', status: 'BLOQUEADO', ultimoLaudoGnv: '18/09/2024', prazoRegularizacaoGnv: '18/09/2025', situacaoGnv: 'VENCIDO' },
    { id: '3', placa: 'SER8B43', renavam: '1355860919', chassi: '93ZA01RF0P8955410', estado: 'SP', status: 'BLOQUEADO', ultimoLaudoGnv: '19/09/2024', prazoRegularizacaoGnv: '19/09/2025', situacaoGnv: 'VENCIDO' },
    { id: '4', placa: 'SWN2B68', renavam: '1383137096', chassi: '9BHCP41BBSP575205', estado: 'SP', status: 'ALERTA', ultimoLaudoGnv: '04/04/2025', prazoRegularizacaoGnv: '04/04/2026', situacaoGnv: 'ATE 4 MESES' },
    { id: '5', placa: 'SSX4B67', renavam: '1379134967', chassi: '9BHCP41BBRP557230', estado: 'SP', status: 'ALERTA', ultimoLaudoGnv: '09/04/2025', prazoRegularizacaoGnv: '09/04/2026', situacaoGnv: 'ATE 4 MESES' },
    { id: '6', placa: 'SER8B56', renavam: '1355855745', chassi: '93ZA01RF0P8955353', estado: 'SP', status: 'ALERTA', ultimoLaudoGnv: '09/04/2025', prazoRegularizacaoGnv: '09/04/2026', situacaoGnv: 'ATE 4 MESES' },
    { id: '7', placa: 'RHV9I16', renavam: '1293503859', chassi: '9BM958134MB233419', estado: 'SP', status: 'ALERTA', ultimoLaudoGnv: '18/07/2025', prazoRegularizacaoGnv: '18/07/2026', situacaoGnv: 'MAIS DE 4 MESES' },
    { id: '8', placa: 'RHV9I13', renavam: '1293505452', chassi: '9BM958134MB233049', estado: 'SP', status: 'ALERTA', ultimoLaudoGnv: '30/07/2025', prazoRegularizacaoGnv: '30/07/2026', situacaoGnv: 'MAIS DE 4 MESES' },
    { id: '9', placa: 'RHV9I20', renavam: '1293502160', chassi: '9BM958134MB224763', estado: 'SP', status: 'ALERTA', ultimoLaudoGnv: '30/07/2025', prazoRegularizacaoGnv: '30/07/2026', situacaoGnv: 'MAIS DE 4 MESES' },
    { id: '10', placa: 'SEF6D88', renavam: '1341349613', chassi: '93ZS62VTZP8841027', estado: 'PR', status: 'ALERTA', ultimoLaudoGnv: '27/01/2026', prazoRegularizacaoGnv: '27/01/2027', situacaoGnv: 'MAIS DE 4 MESES' },
  ],
  GRAVAME: [
    { id: '1', placa: 'FCE5F62', renavam: '1390663121', chassi: '9BWBH6BF3R4078287', estado: 'SP', status: 'ALERTA', gravame: 'VEÍCULO COM ALIENAÇÃO FIDUCIÁRIA PENDENTE EMISSÃO DE DOCUMENTO' },
    { id: '2', placa: 'RHW8G96', renavam: '1295265009', chassi: '9BGEA69H0NG204865', estado: 'PR', status: 'ALERTA', gravame: 'VEÍCULO COM ALIENAÇÃO FIDUCIÁRIA PENDENTE EMISSÃO DE DOCUMENTO' },
    { id: '3', placa: 'STX9J51', renavam: '1384703109', chassi: '9BWCH6CH1RP050068', estado: 'SP', status: 'ALERTA', gravame: 'VEÍCULO COM ALIENAÇÃO FIDUCIÁRIA PENDENTE EMISSÃO DE DOCUMENTO' },
    { id: '4', placa: 'SYD0I26', renavam: '1371948302', chassi: '9BHCP51BBRP538759', estado: 'MG', status: 'ALERTA', gravame: 'VEÍCULO COM ALIENAÇÃO FIDUCIÁRIA PENDENTE EMISSÃO DE DOCUMENTO' },
    { id: '5', placa: 'SIX2I58', renavam: '1362387689', chassi: '9BGEA48A0RG197373', estado: 'MG', status: 'ALERTA', gravame: 'VEÍCULO COM ALIENAÇÃO FIDUCIÁRIA PENDENTE EMISSÃO DE DOCUMENTO' },
    { id: '6', placa: 'SIX2H83', renavam: '1362386585', chassi: '9BGEA48A0RG198482', estado: 'MG', status: 'ALERTA', gravame: 'VEÍCULO COM ALIENAÇÃO FIDUCIÁRIA PENDENTE EMISSÃO DE DOCUMENTO' },
    { id: '7', placa: 'SIR6G12', renavam: '1359332216', chassi: '9BGEB69A0RG169535', estado: 'MG', status: 'ALERTA', gravame: 'VEÍCULO COM ALIENAÇÃO FIDUCIÁRIA PENDENTE EMISSÃO DE DOCUMENTO' },
    { id: '8', placa: 'SIM6A70', renavam: '1356092796', chassi: '9BGEB69A0RG158318', estado: 'MG', status: 'ALERTA', gravame: 'VEÍCULO COM ALIENAÇÃO FIDUCIÁRIA PENDENTE EMISSÃO DE DOCUMENTO' },
    { id: '9', placa: 'SII4H28', renavam: '1363459349', chassi: '8ADUEFC23RG516776', estado: 'MG', status: 'ALERTA', gravame: 'VEÍCULO COM ALIENAÇÃO FIDUCIÁRIA PENDENTE EMISSÃO DE DOCUMENTO' },
    { id: '10', placa: 'RVS9I58', renavam: '1330010423', chassi: '9BGEB69A0PG235969', estado: 'MG', status: 'ALERTA', gravame: 'VEÍCULO COM ALIENAÇÃO FIDUCIÁRIA PENDENTE EMISSÃO DE DOCUMENTO' },
    { id: '11', placa: 'RMU8G53', renavam: '1260784590', chassi: '8AJDA3CD5M1819261', estado: 'MG', status: 'LIBERADO', gravame: 'VEÍCULO NUNCA CONSTOU NA BASE DO SISTEMA NACIONAL DE GRAVAMES' },
    { id: '12', placa: 'RTU1B28', renavam: '1290871970', chassi: '9BD281A2DNYX12318', estado: 'MG', status: 'LIBERADO', gravame: 'VEÍCULO NUNCA CONSTOU NA BASE DO SISTEMA NACIONAL DE GRAVAMES' },
    { id: '13', placa: 'RTV6G73', renavam: '1291824658', chassi: '9BD281A2DNYX15774', estado: 'MG', status: 'LIBERADO', gravame: 'VEÍCULO NUNCA CONSTOU NA BASE DO SISTEMA NACIONAL DE GRAVAMES' },
    { id: '14', placa: 'RTV6G89', renavam: '1291824925', chassi: '9BD281A2DNYX16431', estado: 'MG', status: 'LIBERADO', gravame: 'VEÍCULO NUNCA CONSTOU NA BASE DO SISTEMA NACIONAL DE GRAVAMES' },
  ],
  PROPRIETARIO: [
    { id: '1', placa: 'RUO7A43', renavam: '1303556844', chassi: '8AP359AFDNU217106', estado: 'MG', status: 'LIBERADO', nomeProprietario: 'UNIDAS LOCADORA S.A', cpfCnpj: '45.736.131/0001-70' },
    { id: '2', placa: 'RUA9A09', renavam: '1295518349', chassi: '9BD358AFNNYM01520', estado: 'MG', status: 'LIBERADO', nomeProprietario: 'UNIDAS LOCADORA S.A', cpfCnpj: '45.736.131/0001-70' },
    { id: '3', placa: 'TDF1J80', renavam: '1417983610', chassi: '9BD281AJHSYG48999', estado: 'MG', status: 'LIBERADO', nomeProprietario: 'UNIDAS LOCADORA S.A.', cpfCnpj: '45.736.131/0001-70' },
    { id: '4', placa: 'EHE9C86', renavam: '1337233320', chassi: '9BWAH5BZ3PT605148', estado: 'SP', status: 'LIBERADO', nomeProprietario: 'UNIDAS LOCADORA SA', cpfCnpj: '45.736.131/0148-04' },
    { id: '5', placa: 'SDT6I30', renavam: '1318572280', chassi: '93YRBB002PJ360128', estado: 'PR', status: 'LIBERADO', nomeProprietario: 'OURO VERDE LOCACAO E SERVICO S.A.', cpfCnpj: '75.609.123/0001-23' },
    { id: '6', placa: 'SDU4J72', renavam: '1319711690', chassi: '93YRBB001PJ354689', estado: 'PR', status: 'LIBERADO', nomeProprietario: 'OURO VERDE LOCACAO E SERVICO S.A.', cpfCnpj: '75.609.123/0001-23' },
    { id: '7', placa: 'FCE5F62', renavam: '1390663121', chassi: '9BWBH6BF3R4078287', estado: 'SP', status: 'LIBERADO', nomeProprietario: 'UNIDAS LOCACOES E SERVICOS SA', cpfCnpj: '75.609.123/0025-09' },
    { id: '8', placa: 'RHW8G96', renavam: '1295265009', chassi: '9BGEA69H0NG204865', estado: 'PR', status: 'LIBERADO', nomeProprietario: 'OURO VERDE LOCACAO E SERVICO S.A.', cpfCnpj: '75.609.123/0001-23' },
    { id: '9', placa: 'STX9J51', renavam: '1384703109', chassi: '9BWCH6CH1RP050068', estado: 'SP', status: 'LIBERADO', nomeProprietario: 'UNIDAS LOCADORA SA', cpfCnpj: '45.736.131/0148-04' },
  ],
  CRLV: [
    { id: '1', placa: 'RUA9A09', renavam: '1295518349', chassi: '9BD358AFNNYM01520', estado: 'MG', status: 'ALERTA', ultimoLicenciamento: '2024' },
    { id: '2', placa: 'RUO7A43', renavam: '1303556844', chassi: '8AP359AFDNU217106', estado: 'MG', status: 'ALERTA', ultimoLicenciamento: '2025' },
    { id: '3', placa: 'SDT6I30', renavam: '1318572280', chassi: '93YRBB002PJ360128', estado: 'PR', status: 'ALERTA', ultimoLicenciamento: '2025' },
    { id: '4', placa: 'FCE5F62', renavam: '1390663121', chassi: '9BWBH6BF3R4078287', estado: 'SP', status: 'ALERTA', ultimoLicenciamento: '2025' },
    { id: '5', placa: 'TDF1J80', renavam: '1417983610', chassi: '9BD281AJHSYG48999', estado: 'MG', status: 'LIBERADO', ultimoLicenciamento: '2026' },
    { id: '6', placa: 'EHE9C86', renavam: '1337233320', chassi: '9BWAH5BZ3PT605148', estado: 'SP', status: 'LIBERADO', ultimoLicenciamento: '2026' },
    { id: '7', placa: 'SDU4J72', renavam: '1319711690', chassi: '93YRBB001PJ354689', estado: 'PR', status: 'LIBERADO', ultimoLicenciamento: '2026' },
    { id: '8', placa: 'RHW8G96', renavam: '1295265009', chassi: '9BGEA69H0NG204865', estado: 'PR', status: 'LIBERADO', ultimoLicenciamento: '2026' },
    { id: '9', placa: 'STX9J51', renavam: '1384703109', chassi: '9BWCH6CH1RP050068', estado: 'SP', status: 'LIBERADO', ultimoLicenciamento: '2026' },
  ],
  IPVA: [
    { id: '1', placa: 'RUO7A43', renavam: '1303556844', chassi: '8AP359AFDNU217106', estado: 'MG', status: 'LIBERADO', valorIpva: 'R$ -' },
    { id: '2', placa: 'RUA9A09', renavam: '1295518349', chassi: '9BD358AFNNYM01520', estado: 'MG', status: 'LIBERADO', valorIpva: 'R$ -' },
    { id: '3', placa: 'TDF1J80', renavam: '1417983610', chassi: '9BD281AJHSYG48999', estado: 'MG', status: 'LIBERADO', valorIpva: 'R$ -' },
    { id: '4', placa: 'EHE9C86', renavam: '1337233320', chassi: '9BWAH5BZ3PT605148', estado: 'SP', status: 'LIBERADO', valorIpva: 'R$ -' },
    { id: '5', placa: 'SDT6I30', renavam: '1318572280', chassi: '93YRBB002PJ360128', estado: 'PR', status: 'LIBERADO', valorIpva: 'R$ -' },
    { id: '6', placa: 'SDU4J72', renavam: '1319711690', chassi: '93YRBB001PJ354689', estado: 'PR', status: 'LIBERADO', valorIpva: 'R$ -' },
    { id: '7', placa: 'FCE5F62', renavam: '1390663121', chassi: '9BWBH6BF3R4078287', estado: 'SP', status: 'LIBERADO', valorIpva: 'R$ -' },
    { id: '8', placa: 'RHW8G96', renavam: '1295265009', chassi: '9BGEA69H0NG204865', estado: 'PR', status: 'LIBERADO', valorIpva: 'R$ -' },
    { id: '9', placa: 'STX9J51', renavam: '1384703109', chassi: '9BWCH6CH1RP050068', estado: 'SP', status: 'LIBERADO', valorIpva: 'R$ -' },
  ],
  LICENCIAMENTO: [
    { id: '1', placa: 'RUO7A43', renavam: '1303556844', chassi: '8AP359AFDNU217106', estado: 'MG', status: 'LIBERADO', taxaLicenciamento: 'R$ -' },
    { id: '2', placa: 'RUA9A09', renavam: '1295518349', chassi: '9BD358AFNNYM01520', estado: 'MG', status: 'LIBERADO', taxaLicenciamento: 'R$ -' },
    { id: '3', placa: 'TDF1J80', renavam: '1417983610', chassi: '9BD281AJHSYG48999', estado: 'MG', status: 'LIBERADO', taxaLicenciamento: 'R$ -' },
    { id: '4', placa: 'EHE9C86', renavam: '1337233320', chassi: '9BWAH5BZ3PT605148', estado: 'SP', status: 'LIBERADO', taxaLicenciamento: 'R$ -' },
    { id: '5', placa: 'SDT6I30', renavam: '1318572280', chassi: '93YRBB002PJ360128', estado: 'PR', status: 'LIBERADO', taxaLicenciamento: 'R$ -' },
    { id: '6', placa: 'SDU4J72', renavam: '1319711690', chassi: '93YRBB001PJ354689', estado: 'PR', status: 'LIBERADO', taxaLicenciamento: 'R$ -' },
    { id: '7', placa: 'FCE5F62', renavam: '1390663121', chassi: '9BWBH6BF3R4078287', estado: 'SP', status: 'ALERTA', taxaLicenciamento: 'R$ 174,08' },
    { id: '8', placa: 'RHW8G96', renavam: '1295265009', chassi: '9BGEA69H0NG204865', estado: 'PR', status: 'LIBERADO', taxaLicenciamento: 'R$ -' },
    { id: '9', placa: 'STX9J51', renavam: '1384703109', chassi: '9BWCH6CH1RP050068', estado: 'SP', status: 'LIBERADO', taxaLicenciamento: 'R$ -' },
  ],
};

// maps each type to the DTO field used for "situação" filtering
const SITUACAO_FIELD: Partial<Record<ConsultaDetalheType, keyof ConsultaDetalheDto>> = {
  SITUACAO_VEICULO: 'status',
  RECALL: 'situacaoRecall',
  GNV: 'situacaoGnv',
  GRAVAME: 'status',
  PROPRIETARIO: 'status',
  CRLV: 'status',
  IPVA: 'status',
  LICENCIAMENTO: 'status',
};

@Injectable()
export class ConsultaDetalheService {
  private readonly _type = signal<ConsultaDetalheType | null>(null);
  private readonly _filter = signal<ConsultaDetalheFilter>({});
  private readonly _page = signal(1);
  private readonly _limit = signal(20);

  readonly isLoading = signal(false);

  readonly items = computed<ConsultaDetalheDto[]>(() => {
    const type = this._type();
    if (!type) return [];

    const { search, estado, situacao } = this._filter();
    let data = MOCK[type] ?? [];

    if (search) {
      const q = search.toLowerCase();
      data = data.filter(
        (v) =>
          v.placa.toLowerCase().includes(q) ||
          v.renavam.includes(q) ||
          v.chassi.toLowerCase().includes(q),
      );
    }

    if (estado?.length) {
      data = data.filter((v) => estado.includes(v.estado));
    }

    if (situacao?.length) {
      const field = SITUACAO_FIELD[type];
      if (field) {
        data = data.filter((v) => situacao.includes(v[field] as string));
      }
    }

    return data;
  });

  readonly pagination = computed<PageMeta>(() => ({
    totalItems: this.items().length,
    currentPage: this._page(),
    itemsPerPage: this._limit(),
    totalPages: Math.max(1, Math.ceil(this.items().length / this._limit())),
    filter: {},
    links: { first: '', previous: '', current: '', next: '', last: '' },
  }));

  setType(type: ConsultaDetalheType) {
    this._type.set(type);
    this._page.set(1);
  }

  setFilter(filter: ConsultaDetalheFilter) {
    this._filter.set(filter);
    this._page.set(1);
  }

  setPage(page: number, limit: number) {
    this._page.set(page);
    this._limit.set(limit);
  }
}
