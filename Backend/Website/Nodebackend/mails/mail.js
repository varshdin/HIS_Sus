var nodemailer = require('nodemailer');
var handlebars = require('handlebars');
var layouts = require('handlebars-layouts');

var fs = require('fs');

const EMAIL = CONFIG.SMTPUser;
const PASSWORD = CONFIG.SMTPPwd;
const FROM_EMAIL = CONFIG.adminMail;

handlebars.registerHelper(layouts(handlebars));
handlebars.registerPartial('layout', fs.readFileSync(path.join(__dirname,'templates/layout.hbs'),'utf8'));

// Create a SMTP transporter object
let transporter = nodemailer.createTransport({
	service: "us-east-1",
	host: 'email.us-east-1.amazonaws.com',
	port: '465',
	secure: true,
	tls: {
		rejectUnauthorized: false
	},
	auth: {
		user: EMAIL,
		pass: PASSWORD
	}
});


module.exports = (options => {
	new Promise((resolve, reject) => {
		fs.readFile(path.join(__dirname, './templates/' + options.template), { encoding: 'utf-8' }, (err, html) => {
			if (err) {
				reject(err);
			} else {
				resolve(html);
			}
		});
	})
	.then(html => {
		var template = handlebars.compile(html);
		// options.context['logo'] = CONFIG.BASE_URL + 'assets/images/logo.jpeg';
		var htmlToSend = template(options.context);
		var FROM = `<${FROM_EMAIL}>`;

		// Message object
		let message = {
			from: FROM,
			to: options.to,
			subject: options.subject,
			html: htmlToSend
		};

		transporter.sendMail(message, (err, info) => {
			if (err) {
				console.log('Error occurred. ' + err.message);
				return process.exit(1);
			}
			console.log('Message sent: %s', info.messageId);
			// Preview only available when sending through an Ethereal account
			console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
		});
	})
	.catch(err => {
		logger.error(err);
	})
})