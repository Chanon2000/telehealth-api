import Joi from 'joi';

export interface IMeetingCreateDto {  
  title: string;
  date_start: Date;
  date_end: Date;
  userId: number;
}

export interface IMeetingUpdateDto extends IMeetingCreateDto {  
  meetingId: number;
}

export const meetingCreateModel = Joi.object({
  title: Joi.string().required(),
  date_start: Joi.date().required().label('Start Date'),
  date_end: Joi.date().required().greater(Joi.ref('date_start')).label('End Date'),
});

export const meetingUpdateModel = Joi.object({
  meetingId: Joi.number().required(),
  title: Joi.string().required(),
  date_start: Joi.date().required(),
  date_end: Joi.date().required(),
});
