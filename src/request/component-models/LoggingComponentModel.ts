'use strict';

/*tslint:disable:no-var-requires */
const messageProcessor = require('../util/request-message-processor');
/*tslint:enable:no-var-requires */

import { ILoggingComponentModel, ILoggingLevelModel, ILogModel } from './ILoggingComponentModel';
import { ILogMessage } from '../messages/ILogMessage';
import { IMessageEnvelope } from '../messages/IMessageEnvelope';

import _ = require('lodash');

class LoggingLevelModel implements ILoggingLevelModel {
    private _level: string;
    private _messages: ILogModel[];
    private _shown: boolean = true;

    public constructor(level: string, messages: ILogModel[]) {
        this._level = level;
        this._messages = messages;
    }

    public get level(): string {
        return this._level;
    }

    public get messages(): ILogModel[] {
        return this._messages;
    }

    public get shown(): boolean {
        return this._shown;
    }

    public set shown(value: boolean) {
        this._shown = value;
    }
}

export class LoggingComponentModel implements ILoggingComponentModel {
    private static getList = messageProcessor.getTypeMessageList;

    private static options = {
        'log-write': LoggingComponentModel.getList
    };

    private _levels: LoggingLevelModel[];
    private _messages: ILogModel[];

    public get isEmpty(): boolean {
        return this._messages.length === 0;
    }

    public get levels(): ILoggingLevelModel[] {
        return this._levels;
    }

    public get messages() {
        let filteredMessages = _(this._messages);

        _.filter(this._levels, level => !level.shown).forEach(level => {
            filteredMessages = filteredMessages.filter(message => message.level !== level.level);
        });

        return filteredMessages.value();
    }

    public get showAll(): boolean {
        return _.all(this._levels, level => level.shown);
    }

    public init(request) {
        const allMessages = messageProcessor.getTypeStucture(request, LoggingComponentModel.options);

        if (allMessages) {
            this._messages = _(allMessages.logWrite)
                .sortBy<IMessageEnvelope<ILogMessage>>('ordinal')
                .map(message => <ILogModel>_.assign({ id: message.id }, message.payload))
                .value();

            const levels: { [key: string]: ILogModel[] } = {};

            _.defaults(levels, _.groupBy(this._messages, message => message.level), {
                Debug: [],
                Verbose: [],
                Information: [],
                Warning: [],
                Error: [],
                Critical: []
            });

            this._levels = _.transform(
                levels,
                (result, messages, level) => {
                    result.push(new LoggingLevelModel(level, messages));
                },
                []);
        }
        else {
            this._levels = [];
            this._messages = [];
        };
    }

    public toggleAll(): void {
        this._levels.forEach(level => {
            level.shown = true;
        });
    }

    public toggleLevel(level: ILoggingLevelModel) {
        level.shown = !level.shown;
    }
}
