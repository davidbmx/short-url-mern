const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const yup = require('yup');
const monk = require('monk');
const cookieParser = require('cookie-parser');
const { nanoid } = require('nanoid');

require('dotenv').config();

const db = monk(process.env.MONGO_URI);
const urls = db.get('urls');
urls.createIndex({ slug: 1}, { unique: true });

const app = express();

app.use(helmet());
app.use(morgan('tiny'));
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.static('./public'));

app.get('/:id', async (req, res, next) => {
    const { id: slug } = req.params;
    try {
        const url = await urls.findOne({ slug });
        if (url) {
            if (!req.cookies.visit) {
                const count = url.clicks + 1;
                await urls.update({ slug }, { $set: {clicks: count}});
            }
            res.cookie('visit', 'ok', { expires: new Date(Date.now() + 900000), httpOnly: true });
            res.redirect(url.url);
        } else {
            res.redirect(`/?error=${slug} not found`);
        }
    } catch(error) {
        console.log(error);
        res.redirect(`/?error=Link not found`);
    }
});

const schema = yup.object().shape({
    slug: yup.string().trim().matches(/^[\w\-]+$/i),
    url: yup.string().trim().url().required(),
});

app.post('/url', async (req, res, next) => {
    let { slug, url } = req.body;
    try {
        await schema.validate({
            slug,
            url
        });
        
        if (!slug) {
            slug = nanoid(5);
        }
        slug = slug.toLowerCase();
        const newUrl = {
            slug,
            url,
            clicks: 0,
        };
        const created = await urls.insert(newUrl);
        res.json(created);
    } catch(error) {
        const customErrors = {};
        if (error.message.startsWith('slug')) {
            customErrors['slug'] = ['This field is invalid.'];
        }

        if (error.message.startsWith('E11000')) {
            customErrors['slug'] = ['This value is in use.'];
        }

        if (error.message.startsWith('url')) {
            customErrors['url'] = ['Must be a valid URL'];
        }

        if (Object.keys(customErrors).length > 0) {
            res.status(400).json({errors: customErrors});
        } else {
            next(error);
        }
    }
});

app.use((error, req, res, next) => {
    if (error.status) {
        res.status(error.status);
    } else {
        res.status(500);
    }
    res.json({
        message: error.message,
        stack: process.env.NODE_ENV === 'production' ? 'prod' : error.stack
    });
});

const port = process.env.POST || 8000;

app.listen(port, () => {
    console.log(`Listening al http://localhost:${port}`);
});
