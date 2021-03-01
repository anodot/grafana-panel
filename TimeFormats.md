# Valid Time Formats

based on [Unicode documentation](https://www.unicode.org/reports/tr35/tr35-dates.html#Date_Field_Symbol_Table)

<table>
  <thead>
  <tr>
    <th>Unit</th>
    <th>Pattern</th>
    <th>Result examples</th>
    <th>Notes</th>
  </tr>
  </thead>
  <tbody>
  <tr>
    <td>Era</td>
    <td>G..GGG</td>
    <td>AD, BC</td>
    <td>
    </td>
  </tr>
  <tr>
    <td>
    </td>
    <td>GGGG</td>
    <td>Anno Domini, Before Christ</td>
    <td>2</td>
  </tr>
  <tr>
    <td>
    </td>
    <td>GGGGG</td>
    <td>A, B</td>
    <td>
    </td>
  </tr>
  <tr>
    <td>Calendar year</td>
    <td>y</td>
    <td>44, 1, 1900, 2017</td>
    <td>5</td>
  </tr>
  <tr>
    <td>
    </td>
    <td>yo</td>
    <td>44th, 1st, 0th, 17th</td>
    <td>5,7</td>
  </tr>
  <tr>
    <td>
    </td>
    <td>yy</td>
    <td>44, 01, 00, 17</td>
    <td>5</td>
  </tr>
  <tr>
    <td>
    </td>
    <td>yyy</td>
    <td>044, 001, 1900, 2017</td>
    <td>5</td>
  </tr>
  <tr>
    <td>
    </td>
    <td>yyyy</td>
    <td>0044, 0001, 1900, 2017</td>
    <td>5</td>
  </tr>
  <tr>
    <td>
    </td>
    <td>yyyyy</td>
    <td>...</td>
    <td>3,5</td>
  </tr>
  <tr>
    <td>Local week-numbering year</td>
    <td>Y</td>
    <td>44, 1, 1900, 2017</td>
    <td>5</td>
  </tr>
  <tr>
    <td>
    </td>
    <td>Yo</td>
    <td>44th, 1st, 1900th, 2017th</td>
    <td>5,7</td>
  </tr>
  <tr>
    <td>
    </td>
    <td>YY</td>
    <td>44, 01, 00, 17</td>
    <td>5,8</td>
  </tr>
  <tr>
    <td>
    </td>
    <td>YYY</td>
    <td>044, 001, 1900, 2017</td>
    <td>5</td>
  </tr>
  <tr>
    <td>
    </td>
    <td>YYYY</td>
    <td>0044, 0001, 1900, 2017</td>
    <td>5,8</td>
  </tr>
  <tr>
    <td>
    </td>
    <td>YYYYY</td>
    <td>...</td>
    <td>3,5</td>
  </tr>
  <tr>
    <td>ISO week-numbering year</td>
    <td>R</td>
    <td>-43, 0, 1, 1900, 2017</td>
    <td>5,7</td>
  </tr>
  <tr>
    <td>
    </td>
    <td>RR</td>
    <td>-43, 00, 01, 1900, 2017</td>
    <td>5,7</td>
  </tr>
  <tr>
    <td>
    </td>
    <td>RRR</td>
    <td>-043, 000, 001, 1900, 2017</td>
    <td>5,7</td>
  </tr>
  <tr>
    <td>
    </td>
    <td>RRRR</td>
    <td>-0043, 0000, 0001, 1900, 2017</td>
    <td>5,7</td>
  </tr>
  <tr>
    <td>
    </td>
    <td>RRRRR</td>
    <td>...</td>
    <td>3,5,7</td>
  </tr>
  <tr>
    <td>Extended year</td>
    <td>u</td>
    <td>-43, 0, 1, 1900, 2017</td>
    <td>5</td>
  </tr>
  <tr>
    <td>
    </td>
    <td>uu</td>
    <td>-43, 01, 1900, 2017</td>
    <td>5</td>
  </tr>
  <tr>
    <td>
    </td>
    <td>uuu</td>
    <td>-043, 001, 1900, 2017</td>
    <td>5</td>
  </tr>
  <tr>
    <td>
    </td>
    <td>uuuu</td>
    <td>-0043, 0001, 1900, 2017</td>
    <td>5</td>
  </tr>
  <tr>
    <td>
    </td>
    <td>uuuuu</td>
    <td>...</td>
    <td>3,5</td>
  </tr>
  <tr>
    <td>Quarter (formatting)</td>
    <td>Q</td>
    <td>1, 2, 3, 4</td>
    <td>
    </td>
  </tr>
  <tr>
    <td>
    </td>
    <td>Qo</td>
    <td>1st, 2nd, 3rd, 4th</td>
    <td>7</td>
  </tr>
  <tr>
    <td>
    </td>
    <td>QQ</td>
    <td>01, 02, 03, 04</td>
    <td>
    </td>
  </tr>
  <tr>
    <td>
    </td>
    <td>QQQ</td>
    <td>Q1, Q2, Q3, Q4</td>
    <td>
    </td>
  </tr>
  <tr>
    <td>
    </td>
    <td>QQQQ</td>
    <td>1st quarter, 2nd quarter, ...</td>
    <td>2</td>
  </tr>
  <tr>
    <td>
    </td>
    <td>QQQQQ</td>
    <td>1, 2, 3, 4</td>
    <td>4</td>
  </tr>
  <tr>
    <td>Quarter (stand-alone)</td>
    <td>q</td>
    <td>1, 2, 3, 4</td>
    <td>
    </td>
  </tr>
  <tr>
    <td>
    </td>
    <td>qo</td>
    <td>1st, 2nd, 3rd, 4th</td>
    <td>7</td>
  </tr>
  <tr>
    <td>
    </td>
    <td>qq</td>
    <td>01, 02, 03, 04</td>
    <td>
    </td>
  </tr>
  <tr>
    <td>
    </td>
    <td>qqq</td>
    <td>Q1, Q2, Q3, Q4</td>
    <td>
    </td>
  </tr>
  <tr>
    <td>
    </td>
    <td>qqqq</td>
    <td>1st quarter, 2nd quarter, ...</td>
    <td>2</td>
  </tr>
  <tr>
    <td>
    </td>
    <td>qqqqq</td>
    <td>1, 2, 3, 4</td>
    <td>4</td>
  </tr>
  <tr>
    <td>Month (formatting)</td>
    <td>M</td>
    <td>1, 2, ..., 12</td>
    <td>
    </td>
  </tr>
  <tr>
    <td>
    </td>
    <td>Mo</td>
    <td>1st, 2nd, ..., 12th</td>
    <td>7</td>
  </tr>
  <tr>
    <td>
    </td>
    <td>MM</td>
    <td>01, 02, ..., 12</td>
    <td>
    </td>
  </tr>
  <tr>
    <td>
    </td>
    <td>MMM</td>
    <td>Jan, Feb, ..., Dec</td>
    <td>
    </td>
  </tr>
  <tr>
    <td>
    </td>
    <td>MMMM</td>
    <td>January, February, ..., December</td>
    <td>2</td>
  </tr>
  <tr>
    <td>
    </td>
    <td>MMMMM</td>
    <td>J, F, ..., D</td>
    <td>
    </td>
  </tr>
  <tr>
    <td>Month (stand-alone)</td>
    <td>L</td>
    <td>1, 2, ..., 12</td>
    <td>
    </td>
  </tr>
  <tr>
    <td>
    </td>
    <td>Lo</td>
    <td>1st, 2nd, ..., 12th</td>
    <td>7</td>
  </tr>
  <tr>
    <td>
    </td>
    <td>LL</td>
    <td>01, 02, ..., 12</td>
    <td>
    </td>
  </tr>
  <tr>
    <td>
    </td>
    <td>LLL</td>
    <td>Jan, Feb, ..., Dec</td>
    <td>
    </td>
  </tr>
  <tr>
    <td>
    </td>
    <td>LLLL</td>
    <td>January, February, ..., December</td>
    <td>2</td>
  </tr>
  <tr>
    <td>
    </td>
    <td>LLLLL</td>
    <td>J, F, ..., D</td>
    <td>
    </td>
  </tr>
  <tr>
    <td>Local week of year</td>
    <td>w</td>
    <td>1, 2, ..., 53</td>
    <td>
    </td>
  </tr>
  <tr>
    <td>
    </td>
    <td>wo</td>
    <td>1st, 2nd, ..., 53th</td>
    <td>7</td>
  </tr>
  <tr>
    <td>
    </td>
    <td>ww</td>
    <td>01, 02, ..., 53</td>
    <td>
    </td>
  </tr>
  <tr>
    <td>ISO week of year</td>
    <td>I</td>
    <td>1, 2, ..., 53</td>
    <td>7</td>
  </tr>
  <tr>
    <td>
    </td>
    <td>Io</td>
    <td>1st, 2nd, ..., 53th</td>
    <td>7</td>
  </tr>
  <tr>
    <td>
    </td>
    <td>II</td>
    <td>01, 02, ..., 53</td>
    <td>7</td>
  </tr>
  <tr>
    <td>Day of month</td>
    <td>d</td>
    <td>1, 2, ..., 31</td>
    <td>
    </td>
  </tr>
  <tr>
    <td>
    </td>
    <td>do</td>
    <td>1st, 2nd, ..., 31st</td>
    <td>7</td>
  </tr>
  <tr>
    <td>
    </td>
    <td>dd</td>
    <td>01, 02, ..., 31</td>
    <td>
    </td>
  </tr>
  <tr>
    <td>Day of year</td>
    <td>D</td>
    <td>1, 2, ..., 365, 366</td>
    <td>9</td>
  </tr>
  <tr>
    <td>
    </td>
    <td>Do</td>
    <td>1st, 2nd, ..., 365th, 366th</td>
    <td>7</td>
  </tr>
  <tr>
    <td>
    </td>
    <td>DD</td>
    <td>01, 02, ..., 365, 366</td>
    <td>9</td>
  </tr>
  <tr>
    <td>
    </td>
    <td>DDD</td>
    <td>001, 002, ..., 365, 366</td>
    <td>
    </td>
  </tr>
  <tr>
    <td>
    </td>
    <td>DDDD</td>
    <td>...</td>
    <td>3</td>
  </tr>
  <tr>
    <td>Day of week (formatting)</td>
    <td>E..EEE</td>
    <td>Mon, Tue, Wed, ..., Sun</td>
    <td>
    </td>
  </tr>
  <tr>
    <td>
    </td>
    <td>EEEE</td>
    <td>Monday, Tuesday, ..., Sunday</td>
    <td>2</td>
  </tr>
  <tr>
    <td>
    </td>
    <td>EEEEE</td>
    <td>M, T, W, T, F, S, S</td>
    <td>
    </td>
  </tr>
  <tr>
    <td>
    </td>
    <td>EEEEEE</td>
    <td>Mo, Tu, We, Th, Fr, Su, Sa</td>
    <td>
    </td>
  </tr>
  <tr>
    <td>ISO day of week (formatting)</td>
    <td>i</td>
    <td>1, 2, 3, ..., 7</td>
    <td>7</td>
  </tr>
  <tr>
    <td>
    </td>
    <td>io</td>
    <td>1st, 2nd, ..., 7th</td>
    <td>7</td>
  </tr>
  <tr>
    <td>
    </td>
    <td>ii</td>
    <td>01, 02, ..., 07</td>
    <td>7</td>
  </tr>
  <tr>
    <td>
    </td>
    <td>iii</td>
    <td>Mon, Tue, Wed, ..., Sun</td>
    <td>7</td>
  </tr>
  <tr>
    <td>
    </td>
    <td>iiii</td>
    <td>Monday, Tuesday, ..., Sunday</td>
    <td>2,7</td>
  </tr>
  <tr>
    <td>
    </td>
    <td>iiiii</td>
    <td>M, T, W, T, F, S, S</td>
    <td>7</td>
  </tr>
  <tr>
    <td>
    </td>
    <td>iiiiii</td>
    <td>Mo, Tu, We, Th, Fr, Su, Sa</td>
    <td>7</td>
  </tr>
  <tr>
    <td>Local day of week (formatting)</td>
    <td>e</td>
    <td>2, 3, 4, ..., 1</td>
    <td>
    </td>
  </tr>
  <tr>
    <td>
    </td>
    <td>eo</td>
    <td>2nd, 3rd, ..., 1st</td>
    <td>7</td>
  </tr>
  <tr>
    <td>
    </td>
    <td>ee</td>
    <td>02, 03, ..., 01</td>
    <td>
    </td>
  </tr>
  <tr>
    <td>
    </td>
    <td>eee</td>
    <td>Mon, Tue, Wed, ..., Sun</td>
    <td>
    </td>
  </tr>
  <tr>
    <td>
    </td>
    <td>eeee</td>
    <td>Monday, Tuesday, ..., Sunday</td>
    <td>2</td>
  </tr>
  <tr>
    <td>
    </td>
    <td>eeeee</td>
    <td>M, T, W, T, F, S, S</td>
    <td>
    </td>
  </tr>
  <tr>
    <td>
    </td>
    <td>eeeeee</td>
    <td>Mo, Tu, We, Th, Fr, Su, Sa</td>
    <td>
    </td>
  </tr>
  <tr>
    <td>Local day of week (stand-alone)</td>
    <td>c</td>
    <td>2, 3, 4, ..., 1</td>
    <td>
    </td>
  </tr>
  <tr>
    <td>
    </td>
    <td>co</td>
    <td>2nd, 3rd, ..., 1st</td>
    <td>7</td>
  </tr>
  <tr>
    <td>
    </td>
    <td>cc</td>
    <td>02, 03, ..., 01</td>
    <td>
    </td>
  </tr>
  <tr>
    <td>
    </td>
    <td>ccc</td>
    <td>Mon, Tue, Wed, ..., Sun</td>
    <td>
    </td>
  </tr>
  <tr>
    <td>
    </td>
    <td>cccc</td>
    <td>Monday, Tuesday, ..., Sunday</td>
    <td>2</td>
  </tr>
  <tr>
    <td>
    </td>
    <td>ccccc</td>
    <td>M, T, W, T, F, S, S</td>
    <td>
    </td>
  </tr>
  <tr>
    <td>
    </td>
    <td>cccccc</td>
    <td>Mo, Tu, We, Th, Fr, Su, Sa</td>
    <td>
    </td>
  </tr>
  <tr>
    <td>AM, PM</td>
    <td>a..aa</td>
    <td>AM, PM</td>
    <td>
    </td>
  </tr>
  <tr>
    <td>
    </td>
    <td>aaa</td>
    <td>am, pm</td>
    <td>
    </td>
  </tr>
  <tr>
    <td>
    </td>
    <td>aaaa</td>
    <td>a.m., p.m.</td>
    <td>2</td>
  </tr>
  <tr>
    <td>
    </td>
    <td>aaaaa</td>
    <td>a, p</td>
    <td>
    </td>
  </tr>
  <tr>
    <td>AM, PM, noon, midnight</td>
    <td>b..bb</td>
    <td>AM, PM, noon, midnight</td>
    <td>
    </td>
  </tr>
  <tr>
    <td>
    </td>
    <td>bbb</td>
    <td>am, pm, noon, midnight</td>
    <td>
    </td>
  </tr>
  <tr>
    <td>
    </td>
    <td>bbbb</td>
    <td>a.m., p.m., noon, midnight</td>
    <td>2</td>
  </tr>
  <tr>
    <td>
    </td>
    <td>bbbbb</td>
    <td>a, p, n, mi</td>
    <td>
    </td>
  </tr>
  <tr>
    <td>Flexible day period</td>
    <td>B..BBB</td>
    <td>at night, in the morning, ...</td>
    <td>
    </td>
  </tr>
  <tr>
    <td>
    </td>
    <td>BBBB</td>
    <td>at night, in the morning, ...</td>
    <td>2</td>
  </tr>
  <tr>
    <td>
    </td>
    <td>BBBBB</td>
    <td>at night, in the morning, ...</td>
    <td>
    </td>
  </tr>
  <tr>
    <td>Hour [1-12]</td>
    <td>h</td>
    <td>1, 2, ..., 11, 12</td>
    <td>
    </td>
  </tr>
  <tr>
    <td>
    </td>
    <td>ho</td>
    <td>1st, 2nd, ..., 11th, 12th</td>
    <td>7</td>
  </tr>
  <tr>
    <td>
    </td>
    <td>hh</td>
    <td>01, 02, ..., 11, 12</td>
    <td>
    </td>
  </tr>
  <tr>
    <td>Hour [0-23]</td>
    <td>H</td>
    <td>0, 1, 2, ..., 23</td>
    <td>
    </td>
  </tr>
  <tr>
    <td>
    </td>
    <td>Ho</td>
    <td>0th, 1st, 2nd, ..., 23rd</td>
    <td>7</td>
  </tr>
  <tr>
    <td>
    </td>
    <td>HH</td>
    <td>00, 01, 02, ..., 23</td>
    <td>
    </td>
  </tr>
  <tr>
    <td>Hour [0-11]</td>
    <td>K</td>
    <td>1, 2, ..., 11, 0</td>
    <td>
    </td>
  </tr>
  <tr>
    <td>
    </td>
    <td>Ko</td>
    <td>1st, 2nd, ..., 11th, 0th</td>
    <td>7</td>
  </tr>
  <tr>
    <td>
    </td>
    <td>KK</td>
    <td>01, 02, ..., 11, 00</td>
    <td>
    </td>
  </tr>
  <tr>
    <td>Hour [1-24]</td>
    <td>k</td>
    <td>24, 1, 2, ..., 23</td>
    <td>
    </td>
  </tr>
  <tr>
    <td>
    </td>
    <td>ko</td>
    <td>24th, 1st, 2nd, ..., 23rd</td>
    <td>7</td>
  </tr>
  <tr>
    <td>
    </td>
    <td>kk</td>
    <td>24, 01, 02, ..., 23</td>
    <td>
    </td>
  </tr>
  <tr>
    <td>Minute</td>
    <td>m</td>
    <td>0, 1, ..., 59</td>
    <td>
    </td>
  </tr>
  <tr>
    <td>
    </td>
    <td>mo</td>
    <td>0th, 1st, ..., 59th</td>
    <td>7</td>
  </tr>
  <tr>
    <td>
    </td>
    <td>mm</td>
    <td>00, 01, ..., 59</td>
    <td>
    </td>
  </tr>
  <tr>
    <td>Second</td>
    <td>s</td>
    <td>0, 1, ..., 59</td>
    <td>
    </td>
  </tr>
  <tr>
    <td>
    </td>
    <td>so</td>
    <td>0th, 1st, ..., 59th</td>
    <td>7</td>
  </tr>
  <tr>
    <td>
    </td>
    <td>ss</td>
    <td>00, 01, ..., 59</td>
    <td>
    </td>
  </tr>
  <tr>
    <td>Fraction of second</td>
    <td>S</td>
    <td>0, 1, ..., 9</td>
    <td>
    </td>
  </tr>
  <tr>
    <td>
    </td>
    <td>SS</td>
    <td>00, 01, ..., 99</td>
    <td>
    </td>
  </tr>
  <tr>
    <td>
    </td>
    <td>SSS</td>
    <td>000, 001, ..., 999</td>
    <td>
    </td>
  </tr>
  <tr>
    <td>
    </td>
    <td>SSSS</td>
    <td>...</td>
    <td>3</td>
  </tr>
  <tr>
    <td>Timezone (ISO-8601 w/ Z)</td>
    <td>X</td>
    <td>-08, +0530, Z</td>
    <td>
    </td>
  </tr>
  <tr>
    <td>
    </td>
    <td>XX</td>
    <td>-0800, +0530, Z</td>
    <td>
    </td>
  </tr>
  <tr>
    <td>
    </td>
    <td>XXX</td>
    <td>-08:00, +05:30, Z</td>
    <td>
    </td>
  </tr>
  <tr>
    <td>
    </td>
    <td>XXXX</td>
    <td>-0800, +0530, Z, +123456</td>
    <td>2</td>
  </tr>
  <tr>
    <td>
    </td>
    <td>XXXXX</td>
    <td>-08:00, +05:30, Z, +12:34:56</td>
    <td>
    </td>
  </tr>
  <tr>
    <td>Timezone (ISO-8601 w/o Z)</td>
    <td>x</td>
    <td>-08, +0530, +00</td>
    <td>
    </td>
  </tr>
  <tr>
    <td>
    </td>
    <td>xx</td>
    <td>-0800, +0530, +0000</td>
    <td>
    </td>
  </tr>
  <tr>
    <td>
    </td>
    <td>xxx</td>
    <td>-08:00, +05:30, +00:00</td>
    <td>2</td>
  </tr>
  <tr>
    <td>
    </td>
    <td>xxxx</td>
    <td>-0800, +0530, +0000, +123456</td>
    <td>
    </td>
  </tr>
  <tr>
    <td>
    </td>
    <td>xxxxx</td>
    <td>-08:00, +05:30, +00:00, +12:34:56</td>
    <td>
    </td>
  </tr>
  <tr>
    <td>Timezone (GMT)</td>
    <td>O...OOO</td>
    <td>GMT-8, GMT+5:30, GMT+0</td>
    <td>
    </td>
  </tr>
  <tr>
    <td>
    </td>
    <td>OOOO</td>
    <td>GMT-08:00, GMT+05:30, GMT+00:00</td>
    <td>2</td>
  </tr>
  <tr>
    <td>Timezone (specific non-locat.)</td>
    <td>z...zzz</td>
    <td>GMT-8, GMT+5:30, GMT+0</td>
    <td>6</td>
  </tr>
  <tr>
    <td>
    </td>
    <td>zzzz</td>
    <td>GMT-08:00, GMT+05:30, GMT+00:00</td>
    <td>2,6</td>
  </tr>
  <tr>
    <td>Seconds timestamp</td>
    <td>t</td>
    <td>512969520</td>
    <td>7</td>
  </tr>
  <tr>
    <td>
    </td>
    <td>tt</td>
    <td>...</td>
    <td>3,7</td>
  </tr>
  <tr>
    <td>Milliseconds timestamp</td>
    <td>T</td>
    <td>512969520900</td>
    <td>7</td>
  </tr>
  <tr>
    <td>
    </td>
    <td>TT</td>
    <td>...</td>
    <td>3,7</td>
  </tr>
  <tr>
    <td>Long localized date</td>
    <td>P</td>
    <td>04/29/1453</td>
    <td>7</td>
  </tr>
  <tr>
    <td>
    </td>
    <td>PP</td>
    <td>Apr 29, 1453</td>
    <td>7</td>
  </tr>
  <tr>
    <td>
    </td>
    <td>PPP</td>
    <td>April 29th, 1453</td>
    <td>7</td>
  </tr>
  <tr>
    <td>
    </td>
    <td>PPPP</td>
    <td>Friday, April 29th, 1453</td>
    <td>2,7</td>
  </tr>
  <tr>
    <td>Long localized time</td>
    <td>p</td>
    <td>12:00 AM</td>
    <td>7</td>
  </tr>
  <tr>
    <td>
    </td>
    <td>pp</td>
    <td>12:00:00 AM</td>
    <td>7</td>
  </tr>
  <tr>
    <td>
    </td>
    <td>ppp</td>
    <td>12:00:00 AM GMT+2</td>
    <td>7</td>
  </tr>
  <tr>
    <td>
    </td>
    <td>pppp</td>
    <td>12:00:00 AM GMT+02:00</td>
    <td>2,7</td>
  </tr>
  <tr>
    <td>Combination of date and time</td>
    <td>Pp</td>
    <td>04/29/1453, 12:00 AM</td>
    <td>7</td>
  </tr>
  <tr>
    <td>
    </td>
    <td>PPpp</td>
    <td>Apr 29, 1453, 12:00:00 AM</td>
    <td>7</td>
  </tr>
  <tr>
    <td>
    </td>
    <td>PPPppp</td>
    <td>April 29th, 1453 at ...</td>
    <td>7</td>
  </tr>
  <tr>
    <td>
    </td>
    <td>PPPPpppp</td>
    <td>Friday, April 29th, 1453 at ...</td>
    <td>2,7</td>
  </tr>
  </tbody>
</table>
