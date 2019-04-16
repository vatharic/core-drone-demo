// Elapsed, Time, Vehicles, Adults, Childrens, Bodies, Injured, Hazmats, Risk Score
const data = [
  ['00:00', 5, 0, 0, 0, 0, 0, 1],
  ['00:01', 5, 0, 0, 0, 0, 0, 1],
  ['00:02', 5, 0, 0, 0, 0, 0, 1],
  ['00:03', 5, 1, 0, 1, 1, 1, 4],
  ['00:04', 5, 1, 0, 1, 1, 1, 4],
  ['00:05', 5, 1, 0, 1, 1, 1, 4],
  ['00:06', 5, 1, 0, 1, 1, 1, 4],
  ['00:07', 5, 1, 0, 1, 1, 1, 4],
  ['00:08', 5, 1, 0, 1, 1, 1, 4],
  ['00:09', 5, 1, 0, 1, 1, 1, 4],
  ['00:10', 5, 1, 0, 1, 1, 1, 4],
  ['00:11', 5, 1, 0, 1, 1, 1, 4],
  ['00:12', 5, 1, 0, 1, 1, 1, 4],
  ['00:13', 5, 1, 0, 1, 1, 1, 4],
  ['00:14', 5, 1, 0, 1, 1, 1, 4],
  ['00:15', 5, 1, 0, 1, 1, 1, 4],
  ['00:16', 5, 1, 0, 1, 1, 1, 4],
  ['00:17', 5, 1, 0, 1, 1, 1, 4],
  ['00:18', 5, 3, 0, 3, 1, 1, 4],
  ['00:19', 5, 3, 0, 3, 1, 1, 6],
  ['00:20', 5, 3, 0, 3, 1, 1, 6],
  ['00:21', 5, 3, 0, 3, 1, 1, 6],
  ['00:22', 5, 3, 0, 3, 1, 1, 6],
  ['00:23', 5, 4, 0, 4, 1, 1, 6],
  ['00:24', 5, 5, 0, 5, 1, 1, 6],
  ['00:25', 5, 5, 2, 7, 1, 1, 7],
  ['00:26', 5, 6, 3, 9, 1, 1, 9],
  ['00:27', 5, 6, 3, 9, 1, 1, 9],
  ['00:28', 5, 6, 3, 9, 1, 1, 9],
  ['00:29', 5, 6, 3, 9, 1, 1, 9],
  ['00:30', 5, 7, 3, 10, 1, 1, 10],
  ['00:31', 5, 7, 3, 10, 1, 1, 10],
  ['00:32', 5, 7, 3, 10, 1, 1, 10],
  ['00:33', 5, 7, 3, 10, 1, 1, 10],
  ['00:34', 5, 7, 3, 10, 1, 1, 10],
  ['00:35', 5, 7, 3, 10, 1, 1, 10],
  ['00:36', 5, 7, 3, 10, 1, 1, 10],
  ['00:37', 5, 7, 3, 10, 1, 1, 10],
  ['00:38', 5, 7, 3, 10, 1, 1, 10],
  ['00:39', 5, 7, 3, 10, 1, 1, 10],
  ['00:40', 5, 7, 3, 10, 1, 1, 10],
  ['00:41', 5, 7, 3, 10, 1, 1, 10],
  ['00:42', 5, 7, 3, 10, 1, 1, 10],
  ['00:43', 5, 7, 3, 10, 1, 1, 10],
  ['00:44', 5, 7, 3, 10, 1, 1, 10],
  ['00:45', 5, 7, 3, 10, 1, 1, 10],
  ['00:46', 5, 7, 3, 10, 1, 1, 10],
  ['00:47', 5, 7, 3, 10, 1, 1, 10],
  ['00:48', 5, 7, 3, 10, 1, 1, 10],
  ['00:49', 5, 7, 3, 10, 1, 1, 10],
  ['00:50', 5, 7, 3, 10, 1, 1, 10],
  ['00:51', 5, 7, 3, 10, 1, 1, 10],
  ['00:52', 5, 7, 3, 10, 1, 1, 10],
  ['00:53', 5, 7, 3, 10, 1, 1, 10],
  ['00:54', 5, 7, 3, 10, 1, 1, 10],
  ['00:55', 5, 7, 3, 10, 1, 1, 10],
  ['00:56', 5, 7, 3, 10, 1, 1, 10],
  ['00:57', 5, 7, 3, 10, 1, 1, 10],
  ['00:58', 5, 7, 3, 10, 1, 1, 10],
  ['00:59', 5, 7, 3, 10, 1, 1, 10],
  ['01:00', 5, 7, 3, 10, 1, 1, 10],
  ['01:01', 5, 7, 3, 10, 1, 1, 10],
  ['01:02', 5, 7, 3, 10, 1, 1, 10],
  ['01:03', 5, 7, 3, 10, 1, 1, 10],
  ['01:04', 5, 7, 3, 10, 1, 1, 10],
  ['01:05', 5, 7, 3, 10, 1, 1, 10],
  ['01:06', 5, 7, 3, 10, 1, 1, 10],
  ['01:07', 5, 7, 3, 10, 1, 1, 10],
  ['01:08', 5, 7, 3, 10, 1, 1, 10],
  ['01:09', 5, 7, 3, 10, 1, 1, 10],
  ['01:10', 5, 7, 3, 10, 1, 1, 10],
  ['01:11', 5, 7, 3, 10, 1, 1, 10],
  ['01:12', 5, 7, 3, 10, 1, 1, 10],
  ['01:13', 5, 7, 3, 10, 1, 1, 10],
  ['01:14', 5, 7, 3, 10, 1, 1, 10],
  ['01:15', 5, 7, 3, 10, 1, 1, 10],
  ['01:16', 5, 7, 3, 10, 1, 1, 10],
  ['01:17', 5, 7, 3, 10, 1, 1, 10],
  ['01:18', 5, 7, 3, 10, 1, 1, 10],
  ['01:19', 5, 7, 3, 10, 1, 1, 10],
  ['01:20', 5, 7, 3, 10, 1, 1, 10],
  ['01:21', 5, 7, 3, 10, 1, 1, 10],
  ['01:22', 5, 7, 3, 10, 1, 1, 10],
  ['01:23', 5, 7, 3, 10, 1, 1, 10],
  ['01:24', 5, 7, 3, 10, 1, 1, 10],
  ['01:25', 5, 7, 3, 10, 1, 1, 10],
  ['01:26', 5, 7, 3, 10, 1, 1, 10],
  ['01:27', 5, 7, 3, 10, 1, 1, 10],
  ['01:28', 5, 7, 3, 10, 1, 1, 10],
  ['01:29', 5, 7, 3, 10, 1, 1, 10],
  ['01:30', 5, 7, 3, 10, 1, 1, 10],
  ['01:31', 5, 7, 3, 10, 1, 1, 10],
  ['01:32', 5, 7, 3, 10, 1, 1, 10],
  ['01:33', 5, 7, 3, 10, 1, 1, 10],
  ['01:34', 5, 7, 3, 10, 1, 1, 10],
  ['01:35', 5, 7, 3, 10, 1, 1, 10],
  ['01:36', 5, 7, 3, 10, 1, 1, 10],
  ['01:37', 5, 7, 3, 10, 1, 1, 10],
  ['01:38', 5, 7, 3, 10, 1, 1, 10],
  ['01:39', 5, 7, 3, 10, 1, 1, 10],
  ['01:40', 5, 7, 3, 10, 1, 1, 10],
  ['01:41', 5, 7, 3, 10, 1, 1, 10],
  ['01:42', 5, 7, 3, 10, 1, 1, 10],
  ['01:43', 5, 7, 3, 10, 1, 1, 10],
  ['01:44', 5, 7, 3, 10, 1, 1, 10],
  ['01:45', 5, 7, 3, 10, 1, 1, 10],
  ['01:46', 5, 7, 3, 10, 1, 1, 10],
  ['01:47', 5, 7, 3, 10, 1, 1, 10],
  ['01:48', 5, 7, 3, 10, 1, 1, 10],
  ['01:49', 5, 7, 3, 10, 1, 1, 10],
  ['01:50', 5, 7, 3, 10, 1, 1, 10],
  ['01:51', 5, 7, 3, 10, 1, 1, 10],
  ['01:52', 5, 7, 3, 10, 1, 1, 10],
  ['01:53', 5, 7, 3, 10, 1, 1, 10],
  ['01:54', 5, 7, 3, 10, 1, 1, 10],
  ['01:55', 5, 7, 3, 10, 1, 1, 10],
  ['01:56', 5, 7, 3, 10, 1, 1, 10],
  ['01:57', 5, 7, 3, 10, 1, 1, 10],
  ['01:58', 5, 7, 3, 10, 1, 1, 10],
  ['01:59', 5, 7, 3, 10, 1, 1, 10],
  ['02:00', 5, 7, 3, 10, 1, 1, 10],
  ['02:01', 5, 7, 3, 10, 1, 1, 10],
  ['02:02', 5, 7, 3, 10, 1, 1, 10],
];

const createMockData = (...args) => {
  const res = {};
  Object.keys(args[0]).forEach((key) => {
    res[key] = [];
    for (let i = 0; i < args[0][key]; i += 1) {
      res[key].push(`${key.slice(0, key.length - 1)}${i + 1}`);
    }
  });
  return res;
};

const mockData = data.map((entry) => {
  const tmpRes = createMockData({
    vehiclues: entry[1],
    adults: entry[2],
    childrens: entry[3],
    bodies: entry[4],
    hazmats: entry[5],
  });
  // eslint-disable-next-line prefer-destructuring
  tmpRes.risk = entry[6];
  return tmpRes;
});

// eslint-disable-next-line import/prefer-default-export
export { mockData };