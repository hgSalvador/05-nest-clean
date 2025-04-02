import { DomainEvent } from "../events/domain-event";
import { DomainEvents } from "../events/domain-events";
import { Entity } from "./entity";

export abstract class AggregateRoot<Props> extends Entity<Props> {
    //Lista de eventos que o AggregateRoot dispara
    private _domainEvents: DomainEvent[] = []

    get domainEvents(): DomainEvent[] {
        return this._domainEvents
    }

    //Funcao para disparar os eventros pre-prontos
    protected addDomainEvent(domainEvent: DomainEvent) {
        this._domainEvents.push(domainEvent)
        DomainEvents.markAggregateForDispatch(this)
    }

    public clearEvents() {
        this._domainEvents = []
    }
}