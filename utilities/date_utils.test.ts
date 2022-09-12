import { diffInBizHours } from "./date_utils";

describe("diffInBizHours", () => {
  test("same day: from 4pm PT to 4:30pm should be 0 hrs", () => {
    const earlierTime = "2022-08-25T23:00:52Z"; // Thu Aug 25 2022 16:00:52 GMT-0700
    const laterTime = "2022-08-25T23:30:07Z"; // Thu Aug 25 2022 16:30:07 GMT-0700
    expect(diffInBizHours(laterTime, earlierTime)).toBe(0);
  });

  test("same day: from 6am PT to 9am should be 0 hrs", () => {
    const earlierTime = "2022-08-25T13:00:00Z"; // Thu Aug 25 2022 06:00:00 GMT-0700
    const laterTime = "2022-08-25T16:01:00Z"; // Thu Aug 25 2022 09:01:00 GMT-0700
    expect(diffInBizHours(laterTime, earlierTime)).toBe(0);
  });

  test("same day: from 6pm PT to 9pm should be 0 hrs", () => {
    const earlierTime = "2022-08-26T01:01:00Z"; // Thu Aug 25 2022 18:01:00 GMT-0700
    const laterTime = "2022-08-26T04:29:00Z"; // Thu Aug 25 2022 21:29:00 GMT-0700
    expect(diffInBizHours(laterTime, earlierTime)).toBe(0);
  });

  test("same day: from 9:10am PT to 5pm should be 8 hrs", () => {
    const earlierTime = "2022-08-25T16:10:00Z"; // Thu Aug 25 2022 09:10:00 GMT-0700
    const laterTime = "2022-08-26T00:00:00Z"; // Thu Aug 25 2022 17:00:00 GMT-0700
    expect(diffInBizHours(laterTime, earlierTime)).toBe(8);
  });

  test("same day: from 1pm PT to 3:40pm should be 2 hrs", () => {
    const earlierTime = "2022-08-25T20:00:00Z"; // Thu Aug 25 2022 13:00:00 GMT-0700
    const laterTime = "2022-08-25T22:40:00Z"; // Thu Aug 25 2022 15:40:00 GMT-0700
    expect(diffInBizHours(laterTime, earlierTime)).toBe(2);
  });

  test("same day: from 6am PT to 12:00pm should be 3 hrs", () => {
    const earlierTime = "2022-08-25T13:00:00Z"; // Thu Aug 25 2022 06:00:00 GMT-0700
    const laterTime = "2022-08-25T19:10:00Z"; // Thu Aug 25 2022 12:10:00 GMT-0700
    expect(diffInBizHours(laterTime, earlierTime)).toBe(3);
  });

  test("same day: from 12pm PT to 9:30pm should be 5 hrs", () => {
    const earlierTime = "2022-08-25T19:10:00Z"; // Thu Aug 25 2022 12:10:00 GMT-0700
    const laterTime = "2022-08-26T04:30:00Z"; // Thu Aug 25 2022 21:30:00 GMT-0700
    expect(diffInBizHours(laterTime, earlierTime)).toBe(5);
  });

  test("2 biz days: from 5pm PT to 9am should be 0 hrs", () => {
    const earlierTime = "2022-08-26T00:01:00Z"; // Thu Aug 25 2022 17:01:00 GMT-0700
    const laterTime = "2022-08-26T16:10:00Z"; // Fri Aug 26 2022 09:00:10 GMT-0700
    expect(diffInBizHours(laterTime, earlierTime)).toBe(0);
  });

  test("2 biz days: from 6pm PT to 10am should be 1 hr", () => {
    const earlierTime = "2022-08-26T01:00:52Z"; // Thu Aug 25 2022 18:00:52 GMT-0700
    const laterTime = "2022-08-26T17:05:07Z"; // Fri Aug 26 2022 10:05:07 GMT-0700
    expect(diffInBizHours(laterTime, earlierTime)).toBe(1);
  });

  test("2 biz days: from 4pm PT to 10am should be 2 hrs", () => {
    const earlierTime = "2022-08-25T23:00:52Z"; // Thu Aug 25 2022 16:00:52 GMT-0700
    const laterTime = "2022-08-26T17:05:07Z"; // Fri Aug 26 2022 10:05:07 GMT-0700
    expect(diffInBizHours(laterTime, earlierTime)).toBe(2);
  });

  test("3 biz days", () => {
    const earlierTime = "2022-08-23T20:00:00Z"; // Tue Aug 23 2022 13:00:00 GMT-0700
    const laterTime = "2022-08-25T16:10:00Z"; // Thu Aug 25 2022 09:10:00 GMT-0700
    expect(diffInBizHours(laterTime, earlierTime)).toBe(12);
  });

  test("weekend: from 4pm PT Fri to 11:00am Mon should be 3 hrs", () => {
    const earlierTime = "2022-08-26T23:00:00Z"; // Fri Aug 26 2022 16:00:00 GMT-0700
    const laterTime = "2022-08-29T18:00:00Z"; // Mon Aug 29 2022 11:00:00 GMT-0700
    expect(diffInBizHours(laterTime, earlierTime)).toBe(3);
  });

  test("weekend: from 3pm PT Fri to 10am Sat should be 2 hrs", () => {
    const earlierTime = "2022-08-26T22:00:07Z"; // Fri Aug 26 2022 15:00:07 GMT-0700
    const laterTime = "2022-08-27T17:05:07Z"; // Sat Aug 27 2022 10:05:07 GMT-0700
    expect(diffInBizHours(laterTime, earlierTime)).toBe(2);
  });

  test("weekend: from 8am PT Fri to 9:40am Mon should be 9 hrs", () => {
    const earlierTime = "2022-08-26T15:00:00Z"; // Fri Aug 26 2022 08:00:00 GMT-0700
    const laterTime = "2022-08-27T17:05:07Z"; // Sat Aug 27 2022 10:05:07 GMT-0700
    expect(diffInBizHours(laterTime, earlierTime)).toBe(9);
  });

  test("weekend: from 10am PT Sat to 12pm Sat should be 0 hrs", () => {
    const earlierTime = "2022-08-27T17:05:07Z"; // Sat Aug 27 2022 10:05:07 GMT-0700
    const laterTime = "2022-08-29T16:40:00Z"; // Mon Aug 29 2022 09:40:00 GMT-0700
    expect(diffInBizHours(laterTime, earlierTime)).toBe(0);
  });
});
