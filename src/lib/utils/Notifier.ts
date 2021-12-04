// a class that represents a single subscriber
export class Subscriber<T> {
    _subscriber: (value: T) => void;
    private _unsubscriber: () => void;
    
    // creates a notifier
    constructor(subscriber: (value: T) => void, unsubscriber: () => void) {
        this._subscriber = subscriber;
        this._unsubscriber = unsubscriber;
    }
    
    // unsubscribe from the notifier
    public unsubscribe(): void {
        this._unsubscriber();
    }
    
    // notifies the subscriber of the given value
    public notify(value: T): void {
        this._subscriber(value);
    }
}

// base class for all notifier implementations
export class Notifier<T> {
    private _subscribers: Subscriber<T>[];

    constructor() {
        this._subscribers = [];
    }

    // subscribes a new subscriber to the notifier
    public subscribe(subscriber: (value: T) => void): Subscriber<T> {
        const unsubscriber = this.addSubscriber(subscriber);
        return new Subscriber(subscriber, unsubscriber);
    }

    protected addSubscriber(subscriber: (value: T) => void): () => void {
        this._subscribers.push(new Subscriber(subscriber, () => {
            this.removeSubscriber(subscriber);
        }));
        return this._subscribers[this._subscribers.length - 1].unsubscribe.bind(this._subscribers[this._subscribers.length - 1]);
    }

    protected removeSubscriber(subscriber: (value: T) => void): void {
        this._subscribers = this._subscribers.filter(s => s._subscriber !== subscriber);
    }

    // notify all subscribers of a given value
    public notify(value: T): void {
        this._subscribers.forEach(s => s.notify(value));
    }

    // unsubscribe all subscribers
    public unsubscribeAll(): void {
        this._subscribers.forEach(s => s.unsubscribe());
    }

    // returns an array of all the subscribers
    public getSubscribers(): Subscriber<T>[] {
        return this._subscribers;
    }
}

export class ValueNotifier<T> extends Notifier<T> {
    private _value: T;
    constructor(value: T) {
        super();
        this._value = value;
    }
    public subscribe(subscriber: (value: T) => void): Subscriber<T> {
        subscriber(this._value);
        return super.subscribe(subscriber);
    }

    public get value(): T {
        return this._value;
    }

    public set value(value: T) {
        this._value = value;
        this.notify(value);
    }
}