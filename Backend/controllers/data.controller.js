import Completion from "../model/completion.model.js";

export const getData=async(req,res)=>{
  try{
    const data=await Completion.find({userId: req.user._id});
    console.log(data);
    
    res.json(data);
  }
  catch(error){
    console.log(error.message);
    res.status(500).json({error:"Cannot get Data"});
  }
}

export const postData = async (req, res) => {
  try {
    const operations = req.body.map(item => ({
      updateOne: {
        filter: {
          userId: req.user._id,
          habitName: item.habitName,
          date: item.date
        },
        update: {
          $set: {
            completed: item.completed
          }
        },
        upsert: true // 👈 Create if it doesn't exist
      }
    }));

    await Completion.bulkWrite(operations);
    res.status(201).json({ message: "Data saved successfully" });
  } catch (error) {
    console.error("Error in postData controller:", error.message);
    res.status(500).json({ error: "Cannot save data" });
  }
};
