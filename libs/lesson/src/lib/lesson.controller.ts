import { Controller,Get, Param, UseGuards, Post, Body, Put, Req } from "@nestjs/common";
import { LessonService } from "./lesson.service";
import { LessonDTO, FileDTO, LessonFilterDTO, ShareLessonDTO, NewFileDTO, UpdatedFileDTO } from "./lesson.dto";
import { UserDTO} from "../../../user/src/lib/user.dto"
import { AuthGuard } from "@nestjs/passport";
import { fileURLToPath } from "url";

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

  @Get(':lessonId/fileNames')
  async GetLessonFileNames(@Param() params): Promise<string[]>
  {
    return await this.lessonService.getLessonFileNames(params.lessonId)

  }

  @Post(':lessonId/submit')
  async SubmitLesson(@Req() req, @Param() params)
  {
    await this.lessonService.submitLesson(req.user.token,params.lessonId)

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

  @Get(':lessonId/files/:fileName')
  async GetLessonFile(@Param('lessonId') lessonId, @Param('fileName') fileName): Promise<FileDTO>
  {
    const {lesson, ...fileDTO} = await this.lessonService.getLessonFile(lessonId, fileName)
    return fileDTO
  }

  @Post(':lessonId/user')
  async AddLessonUser(@Param() params, @Body() shareLesson: ShareLessonDTO)
  {
    await this.lessonService.addLessonUser(params.lessonId, shareLesson);
    
  }

  @Post(':lessonid/files')
  async AddLessonFile(@Param() params, @Body() newFile: NewFileDTO ): Promise<number>
  {
    return await this.lessonService.addLessonFile(params.lessonId,newFile);
  }

  @Put(':lessonid/files')
  async UpdateLessonFile(@Param() params, @Body() updatedFile: UpdatedFileDTO ): Promise<FileDTO>
  {
    const {lesson, ...fileDTO} = await this.lessonService.updateLessonFile(params.lessonId,updatedFile);
    return fileDTO
  }

}
