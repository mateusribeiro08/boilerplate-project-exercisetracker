app.get('/api/users/:_id/logs', async (req, res) => {
  const { from, to, limit } = req.query;
  const id = req.params._id;

  const user = await User.findById(id);
  if (!user) {
    return res.send("Could not find user");
  }

  let dateFilter = {};
  if (from) dateFilter["$gte"] = new Date(from);
  if (to) dateFilter["$lte"] = new Date(to);

  let filter = { user_id: id };
  if (from || to) {
    filter.date = dateFilter;
  }

  let query = Exercise.find(filter);

  if (limit) {
    query = query.limit(parseInt(limit));
  }

  const exercises = await query.exec();

  const log = exercises.map(e => ({
    description: e.description,
    duration: e.duration,
    date: e.date.toDateString()
  }));

  res.json({
    _id: user._id,
    username: user.username,
    count: exercises.length,
    log
  });
});
