import {ExtRequest} from "../../../../definitions/ext_request";
import {ProjectJobStatus, projectModel} from "../../../../database/models/project";
import s3 from "../../../../util/s3";
import express from "express";

export default function download_results_route() {
    let router = express.Router();
    router.get('/file_download/results', async (req: ExtRequest, res) => {
        let {id} = req.query;
        if(!id)
            return res.status(400).send("Missing job id parameter.");

        try {
            if (process.env.S3_BUCKET_NAME) {
                const job = await projectModel.findById(id);
                if (!job) {
                    return res.status(404).send("Job not found.");
                }
                if (job.status != ProjectJobStatus[ProjectJobStatus.DONE]) {
                    return res.status(400).send("Job not completed.");
                }

                let params: any = {
                    Bucket: process.env.S3_BUCKET_NAME!,
                    Key: String(job.resultName),
                }
                let presignedUrl = await s3.getSignedUrlPromise('getObject', params);
                res.status(200).send({presignedUrl});
            } else res.status(500).send("S3-BucketName is not set");
        } catch (err) {
            console.log(err);
            res.status(500).send(err);
        }
    })
    return router;
}