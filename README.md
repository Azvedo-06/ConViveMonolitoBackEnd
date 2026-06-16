# ConVive — Plataforma Web de Inclusão Social e Eventos Comunitários

## Sobre o Projeto

O ConVive é uma plataforma web desenvolvida com o objetivo de promover inclusão social, participação comunitária, saúde, bem-estar e acesso à informação através da divulgação de eventos, atividades, cursos e ações sociais.

Além das funcionalidades comunitárias, o sistema também passou a incluir suporte para eventos privados com venda de ingressos online, oferecendo uma alternativa mais acessível financeiramente em comparação às grandes plataformas concorrentes.

O projeto busca atender:

- Organizadores de eventos comunitários;
- Pequenos produtores de eventos;
- Instituições sociais;
- Usuários que desejam participar de eventos públicos e privados.

O sistema permitirá gerenciamento de eventos, inscrições, controle de participantes e venda de ingressos digitais.

O projeto está alinhado aos Objetivos de Desenvolvimento Sustentável (ODS):

- ODS 3 — Saúde e Bem-Estar
- ODS 10 — Redução das Desigualdades
- ODS 11 — Cidades e Comunidades Sustentáveis

### Objetivo do Sistema

Criar uma plataforma centralizada para gerenciamento e divulgação de ações comunitárias, facilitando a comunicação entre organizadores e participantes.

### Regra de Negócio Principal

Funcionalidade Principal: Criação e Gerenciamento de Eventos Públicos e Privados

## Fluxo da Regra de Negócio

- 1 O organizador realiza login no sistema;
- 2 O organizador cadastra um evento;
- 3 O sistema define se o evento será público ou privado;
- 4 O sistema valida os dados do evento;
- 5 O evento é salvo no banco de dados;
- 6 O evento é disponibilizado na plataforma;
- 7 Usuários podem visualizar detalhes do evento;
- 8 O usuário realiza inscrição ou compra do ingresso;
- 9 O sistema verifica disponibilidade de vagas;
- 10 O pagamento é processado;
- 11 A inscrição é confirmada;
- 12 O sistema gera confirmação digital de participação.

## Arquitetura do Projeto

O backend foi desenvolvido utilizando:

- NestJS
- Sequelize + PostgreSQL
- JWT para autenticação
- Arquitetura modular

Cada funcionalidade possui:
- Controller
- dtos(interfaces) / mappers
- Service
- Model (Sequelize) Entity

## Padrões Utilizados
Decorator Pattern

Utilizado principalmente através dos decorators do NestJS.

Exemplos:

@Controller()
@Injectable()
@Get()
@Post()
@UseGuards()

Motivo

- Melhora organização do código e separa responsabilidades e testabilidade.

## Princípios do SOLID Aplicados

O projeto adota boas práticas de design alinhadas com os princípios do SOLID:

1. **SRP — Single Responsibility Principle (Princípio da Responsabilidade Única):**
   * Cada componente do projeto possui uma única responsabilidade de negócio bem delimitada. 
   * **Controllers** (ex: `EventsController`) gerenciam apenas o protocolo HTTP, cabeçalhos e rotas.
   * **Services** (ex: `EventsService`) contêm apenas as regras de negócio e lógica de aplicação.
   * **Models** (ex: `Event` model) representam apenas a estrutura e relacionamento das tabelas do banco.
   * **DTOs** (ex: `CreateEventDto`) servem apenas para transporte e validação estrutural dos dados de entrada.

2. **DIP — Dependency Inversion Principle (Princípio da Inversão de Dependência):**
   * As classes de alto nível não dependem de classes de baixo nível; ambas dependem de abstrações.
   * Em `EventsService`, a conexão com o banco de dados é invertida por meio de injeção de dependência via construtor (`@InjectModel(Event) private readonly eventModel: typeof Event`). Isso desacopla o serviço da implementação real do Sequelize, permitindo mockar facilmente o banco e rodar testes unitários isolados com sucesso.

## Fluxograma Estrutural

![Fluxograma](docs/FluxogramaEstruturalConvive.drawio.png)


