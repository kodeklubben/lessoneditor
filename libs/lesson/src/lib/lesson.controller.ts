import { Controller,Get, Param, Query, BadRequestException, Post, Body, Put } from "@nestjs/common";
import { LessonService } from "./lesson.service";
import { LessonDTO, FileDTO, LessonFilterDTO, ShareLessonDTO, NewFileDTO, UpdatedFileDTO } from "./lesson.dto";
import { UserDTO} from "../../../user/src/lib/user.dto"

@Controller("lesson")
export class LessonController {
  constructor(private lessonService: LessonService) {
  }

  @Get(':lessonId')
  async GetLesson(@Param() params): Promise<LessonDTO>
  {
    const {users, files, ...lessonDTO} = await this.lessonService.getLesson(params.lessonId)
    return lessonDTO
  }

  @Get(':lessonId/users')
  async GetLessonUsers(@Param() params): Promise<UserDTO[]>
  {
    const {users, files, ...lessonDTO} = await this.lessonService.getLesson(params.lessonId)
    const userArray: UserDTO[] = users.map(function(user){
      const {lessons, ...userDTO} = user
      return userDTO
    })
    return userArray

  }

  @Get(':lessonId/files')
  async GetLessonFiles(@Param() params): Promise<FileDTO[]>
  {
    const {users, files, ...lessonDTO} = await this.lessonService.getLesson(params.lessonId)
    const filesArray: FileDTO[] = files.map(function(file){
      const {lesson, ...fileDTO} = file
      return fileDTO
    })
    return filesArray
  }

  @Post(':lessonId/user')
  async AddLessonUser(@Param() params, @Body() shareLesson: ShareLessonDTO)
  {
    await this.lessonService.addLessonUser(params.lessonId, shareLesson);
    
  }

  @Post(':lessonid/file')
  async AddUserFile(@Param() params, @Body() newFile: NewFileDTO ): Promise<number>
  {
    return await this.lessonService.addLessonFile(params.lessonId,newFile);
  }

  @Put(':lessonid/file')
  async UpdateUserFile(@Param() params, @Body() updatedFile: UpdatedFileDTO ): Promise<number>
  {
    return await this.lessonService.updateLessonFile(params.lessonId,updatedFile);
  }

}
