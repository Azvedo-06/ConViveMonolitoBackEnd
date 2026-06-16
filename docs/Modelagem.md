# Modelagem de Dados e Classes — ConVive

Este documento descreve a modelagem de entidades do banco de dados (DER) e o diagrama de classes principais do projeto **ConVive**.

---

## 1. Diagrama de Entidade-Relacionamento (DER)

O diagrama abaixo ilustra a estrutura de tabelas do banco de dados PostgreSQL (gerenciado através do Sequelize) e seus respectivos relacionamentos:

```mermaid
erDiagram
    users {
        int id PK
        string name
        string cpf
        string phone
        string email
        string password
        enum role
        string linkedin
        string instagram
        string youtube
        string cnpj
        string cep
        timestamp created_at
        timestamp updated_at
    }

    events {
        int id PK
        string title
        text description
        string location
        datetime date
        enum type
        float price
        int max_participants
        int created_by FK
        string category
        string city
        string image_url
        timestamp created_at
        timestamp updated_at
    }

    event_participants {
        int id PK
        int event_id FK
        int user_id FK
        timestamp created_at
        timestamp updated_at
    }

    chat_messages {
        int id PK
        int event_id FK
        int user_id FK
        text message
        timestamp created_at
        timestamp updated_at
    }

    users ||--o{ events : "cria"
    users ||--o{ event_participants : "participa"
    events ||--o{ event_participants : "contém"
    users ||--o{ chat_messages : "envia"
    events ||--o{ chat_messages : "contém"
```

---

## 2. Diagrama de Classes

O diagrama de classes abaixo mostra as relações entre os principais componentes de negócio (Controllers, Services, Models e DTOs) do módulo de **Eventos** (`Events`):

```mermaid
classDiagram
    class EventsController {
        -EventsService eventsService
        +create(createEventDto, req)
        +update(id, updateEventDto, req)
        +remove(id, req)
        +joinEvent(id, req)
        +getParticipants(id)
        +findAll(city)
        +findMyEvents(req)
        +findOne(id)
        +uploadImage(id, file)
        +getMessages(id, req)
        +sendMessage(id, createChatMessageDto, req)
    }

    class EventsService {
        -typeof Event eventModel
        -typeof EventParticipant participantModel
        -typeof ChatMessage chatMessageModel
        +create(createEventDto, userId)
        +findAll(city)
        +findOne(id)
        +update(id, updateEventDto, userId, userRole)
        +remove(id, userId, userRole)
        +joinEvent(eventId, userId)
        +getParticipants(eventId)
        +uploadImage(eventId, filename)
        +findUserEvents(userId)
        +getMessagesForEvent(eventId, userId, userRole)
        +sendMessageToEvent(eventId, userId, userRole, messageContent)
    }

    class Event {
        +int id
        +string title
        +string description
        +string location
        +Date date
        +EventType type
        +number price
        +number maxParticipants
        +int createdBy
        +string category
        +string city
        +string imageUrl
    }

    class EventParticipant {
        +int id
        +int eventId
        +int userId
    }

    class ChatMessage {
        +int id
        +int eventId
        +int userId
        +string message
    }

    EventsController --> EventsService : "delega requisições"
    EventsService --> Event : "gerencia persistência"
    EventsService --> EventParticipant : "gerencia persistência"
    EventsService --> ChatMessage : "gerencia persistência"
```
