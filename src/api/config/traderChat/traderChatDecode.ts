import {
    buildApiItemDefault,
    buildApiItemSimple,
    buildArrayDecoderModel,
    buildModelValidator
} from "src/api/utils/modelUtils";
import {
    buildOptionalDecoderModel,
    decodeNumber,
    decodeString,
    decodeStringArr,
    decodeStringOrUndefined
} from "src/api/utils/commonModelValidators";
import * as t from 'io-ts';
import { buildValidator } from "@twoupdigital/mobx-utils/libjs/buildValidator";

export const decodeTemplate = buildModelValidator('decodeTemplate', {
    messageTemplates: buildApiItemDefault(decodeStringArr, []),
    scheduleStart: buildApiItemDefault(decodeString, ''),
    scheduleEnd: buildApiItemDefault(decodeString, ''),
});

const senderType = buildValidator('senderType', t.union([
    t.literal("staff"),
    t.literal("customer"),
    t.literal("system")
]));
export const decodeSender = buildModelValidator('decodeSender', {
    id: buildApiItemDefault(decodeNumber, 0),
    type: buildApiItemSimple(senderType),
    name: buildApiItemDefault(decodeString, ''),
});
export type ChatSenderType = ReturnType<typeof decodeSender>;

const decodeContent = buildModelValidator('decodeContent', {
    text: buildApiItemDefault(decodeString, ''),
});

const messageType = buildValidator('decodeSenderType', t.union([
    t.literal("assigned"),
    t.literal("standard"),
    t.literal("ended"),
    t.literal("unassigned"),
    t.literal("typing"),
]));
export const decodeMessage = buildModelValidator('decodeMessage', {
    id: buildApiItemDefault(decodeString, ''),
    sender: buildApiItemSimple(decodeSender),
    sentAt: buildApiItemDefault(decodeString, ''),
    tags: buildApiItemDefault(decodeStringArr, []),
    type: buildApiItemSimple(messageType),
    content: buildApiItemSimple(buildOptionalDecoderModel(decodeContent)),
    chatId: buildApiItemDefault(decodeStringOrUndefined, ''),
});
export type ChatMessageType = ReturnType<typeof decodeMessage>;

export const decodeParticipant = buildModelValidator('decodeParticipant', {
    account: buildApiItemSimple(decodeSender),
    role: buildApiItemDefault(decodeString, ''),
});

export const chatStatusModel = {
    typeId: buildApiItemDefault(decodeString, ''),
    universe: buildApiItemDefault(decodeString, ''),
    templates: buildApiItemSimple(decodeTemplate),
    who: buildApiItemSimple(decodeSender),
    lastUpdatedDate: buildApiItemDefault(decodeString, ''),
};

export const chatTemplatesModel = {
    templates: buildApiItemSimple(decodeTemplate),
};

export const chatDataModel = {
    id: buildApiItemDefault(decodeString, ''),
    messages: buildApiItemSimple(buildArrayDecoderModel(decodeMessage)),
    participants: buildApiItemSimple(buildArrayDecoderModel(decodeParticipant)),
    universeId: buildApiItemDefault(decodeString, ''),
};


export const decodeError = buildModelValidator('decodeError', {
    code: buildApiItemSimple(decodeString),
    debugDetails: buildApiItemDefault(decodeString, ''),
    field: buildApiItemSimple(decodeString),
    resource: buildApiItemSimple(decodeString),
});

export const decodeErrors = buildModelValidator('decodeErrors', {
    errors: buildApiItemSimple(buildArrayDecoderModel(decodeError))
});
export type ErrorsType = ReturnType<typeof decodeErrors>;
