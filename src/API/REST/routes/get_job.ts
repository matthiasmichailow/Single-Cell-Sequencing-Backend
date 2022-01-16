import express from "express";
import {ExtRequest} from "../../../definitions/ext_request";
import {projectModel} from "../../../database/models/project";

export default function get_job_route() {
  let router = express.Router();

  router
    .get("/job/:id", async (req: ExtRequest, res: any) => {
      const jobId = req.params.id;
      const job = await projectModel.findById(jobId);

      if (!job)
        return res.status(404).send(`Job ${jobId} not found`);

      return res.status(200).json(job);
    });
  return router;
}
