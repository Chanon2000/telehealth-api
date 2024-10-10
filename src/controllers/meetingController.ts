import { FastifyReply, FastifyRequest } from "fastify";
import { ERRORS, handleServerError } from "../helpers/errorsHelper";
import { IMeetingCreateDto, IMeetingUpdateDto } from "../models/meeting";
import { STANDARD } from "../models/request";
import { prisma, utils } from "../utils/utils";



export const createMeeting = async (request: FastifyRequest<{Body: IMeetingCreateDto;}>,reply: FastifyReply,) => {
    try {
        const { id } = request['authUser'];
        const { title, date_start, date_end } = request.body;

        if (await utils.isOverlappingMeeting(id, date_start, date_end)) {
            return reply.code(ERRORS.meetingsOverlapping.statusCode).send(ERRORS.meetingsOverlapping);
        }

        const newMeeting = await prisma.meeting.create({
            data: {
                title,
                date_start,
                date_end,
                userId: id
            },
        });
        reply.status(STANDARD.OK.statusCode).send({ data: newMeeting });
    } catch (e) {
        handleServerError(reply, e);
    }
};


export const updateMeeting = async (request: FastifyRequest<{Body: IMeetingUpdateDto;}>,reply: FastifyReply,) => {
    try {
        const { id } = request['authUser'];
        const { meetingId, title, date_start, date_end } = request.body;

        const meeting = await prisma.meeting.findUnique({ where: { id: meetingId } })
        if (!meeting) {
            return reply.code(ERRORS.meetingNotExists.statusCode).send(ERRORS.meetingNotExists);
        }
        if (id !== meeting.userId) {
            return reply.code(ERRORS.meetingNotExists.statusCode).send(ERRORS.meetingCredError);
        }

        if (await utils.isOverlappingMeeting(id, date_start, date_end)) {
            return reply.code(ERRORS.meetingsOverlapping.statusCode).send(ERRORS.meetingsOverlapping);
        }

        const updatedMeeting = await prisma.meeting.update({
            where: { id: meetingId },
            data: {
                title: title,
                date_start: new Date(date_start),
                date_end: new Date(date_end),
            },
        });

        reply.status(STANDARD.OK.statusCode).send({ data: updatedMeeting });
    } catch (e) {
        handleServerError(reply, e);
    }
}

export const deleteMeeting = async (request: FastifyRequest<{Params: { meetingId: number };}>,reply: FastifyReply,) => {
    try {
        const { id } = request['authUser'];
        const { meetingId } = request.params;
        const meeting = await prisma.meeting.findUnique({
            where: { id: meetingId }
        });
        if (!meeting) {
            return reply.code(ERRORS.meetingNotExists.statusCode).send(ERRORS.meetingNotExists);
        }
        if (id !== meeting.userId) {
            return reply.code(ERRORS.meetingNotExists.statusCode).send(ERRORS.meetingCredError);
        }
        await prisma.meeting.delete({
            where: { id: meetingId },
        });

        reply.status(STANDARD.OK.statusCode).send({ msg: "delete meeting successful" });
    } catch (e) {
        handleServerError(reply, e);
    }
}


export const getMeetingById = async (request: FastifyRequest<{Params: { meetingId: number };}>,reply: FastifyReply,) => {
    try {
        const { id } = request['authUser'];
        const { meetingId } = request.params;
        const meeting = await prisma.meeting.findUnique({
            where: { id: meetingId }
        });
        if (!meeting) {
            return reply.code(ERRORS.meetingNotExists.statusCode).send(ERRORS.meetingNotExists);
        }
        if (id !== meeting.userId) {
            return reply.code(ERRORS.meetingNotExists.statusCode).send(ERRORS.meetingCredError);
        }

        reply.status(STANDARD.OK.statusCode).send({ data: meeting });
    } catch (e) {
        handleServerError(reply, e);
    }
}

export const getMeetingsByUser = async (request: FastifyRequest<{Body: IMeetingCreateDto;}>,reply: FastifyReply,) => {
    try {
        const { id } = request['authUser'];
        const meetings = await prisma.meeting.findMany({
            where: { userId: id },
        });
        if (meetings.length <= 0) {
            return reply.code(ERRORS.meetingsNotFound.statusCode).send(ERRORS.meetingsNotFound);
        }
        reply.status(STANDARD.OK.statusCode).send({ data: meetings });
    } catch (e) {
        handleServerError(reply, e);
    }
}

