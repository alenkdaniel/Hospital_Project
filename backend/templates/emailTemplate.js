// =======================================
// PRODUCTION COMMON EMAIL TEMPLATE
// =======================================

const emailTemplate = ({
  title,
  greeting = "Hello",
  message,
  otp,
  actionText,
  actionUrl,
  details,
}) => {
  return `
<!DOCTYPE html>
<html>

<head>
  <meta charset="UTF-8" />

  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
  />
</head>


<body
  style="
    margin:0;
    padding:0;
    background:#f3f4f6;
    font-family:Arial, Helvetica, sans-serif;
  "
>


<table
  width="100%"
  cellpadding="0"
  cellspacing="0"
>

<tr>
<td align="center">


<!-- MAIN CONTAINER -->

<table
  width="600"
  cellpadding="0"
  cellspacing="0"

  style="
    background:#ffffff;
    margin:30px;
    border-radius:12px;
    overflow:hidden;
    box-shadow:0 4px 15px rgba(0,0,0,0.08);
  "
>


<!-- HEADER -->

<tr>
<td
  style="
    background:#006d77;
    padding:25px;
    text-align:center;
    color:white;
  "
>

<h1
  style="
    margin:0;
    font-size:24px;
  "
>
🏥 Hospital Booking
</h1>


<p
  style="
    margin-top:8px;
    font-size:14px;
  "
>
Healthcare at your fingertips
</p>


</td>
</tr>





<!-- BODY -->

<tr>

<td
  style="
    padding:35px;
    color:#333333;
  "
>


<h2
  style="
    margin-top:0;
    color:#111827;
  "
>
${title}
</h2>



<p style="font-size:16px;">
  ${greeting},
</p>



<p
  style="
    font-size:16px;
    line-height:1.6;
  "
>
${message}
</p>





${
  otp
    ? `
<div
  style="
    text-align:center;
    margin:30px 0;
  "
>


<div
  style="
    display:inline-block;
    background:#eef6f6;
    padding:18px 35px;
    border-radius:8px;
    font-size:32px;
    letter-spacing:8px;
    font-weight:bold;
    color:#006d77;
  "
>
${otp}
</div>


<p
  style="
    font-size:13px;
    color:#777;
  "
>
This code expires shortly. Do not share it.
</p>


</div>
`
    : ""
}







${
  details
    ? `
<div
  style="
    background:#f9fafb;
    border-left:4px solid #006d77;
    padding:15px;
    margin:25px 0;
    font-size:15px;
  "
>

${details}

</div>
`
    : ""
}








${
  actionText && actionUrl
    ? `
<div
  style="
    text-align:center;
    margin-top:30px;
  "
>


<a
href="${actionUrl}"

style="
  background:#006d77;
  color:white;
  padding:14px 30px;
  border-radius:6px;
  text-decoration:none;
  font-weight:bold;
  display:inline-block;
"
>

${actionText}

</a>


</div>
`
    : ""
}







<p
  style="
    margin-top:35px;
    font-size:14px;
    color:#666;
  "
>

If you did not request this email,
you can safely ignore it.

</p>


</td>

</tr>







<!-- FOOTER -->


<tr>

<td
  style="
    background:#f1f5f9;
    padding:20px;
    text-align:center;
    font-size:13px;
    color:#666;
  "
>


<p>
© ${new Date().getFullYear()} Hospital Booking System
</p>


<p>
This is an automated email.
Please do not reply.
</p>


</td>

</tr>



</table>


</td>
</tr>


</table>


</body>


</html>
`;
};

export default emailTemplate;
