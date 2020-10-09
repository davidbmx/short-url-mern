import React, { useState } from 'react';

const FormShort = ({ onSubmit, errors, createdUrl, copy }) => {
    const [url, setUrl] = useState('');
    const [slug, setSlug] = useState('');

    return (
        <form onSubmit={(ev) => {
            ev.preventDefault();
            onSubmit(url, slug);
        }}>
            <div className="row">
                <div className="col-12 text-center">
                    <h3>Short url app</h3>
                </div>
                <div className="col-xs-12 col-sm-6">
                    <div className="form-group">
                        <label>*Url</label>
                        <input
                            onChange={(ev) => setUrl(ev.target.value)}
                            className="form-control"
                            value={url}
                        />
                        {
                            errors['url'] ? (
                                <ul>
                                    {errors['url'].map((item, i) => (
                                        <li key={i}>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            ) : ''
                        }
                    </div>
                </div>
                <div className="col-xs-12 col-sm-6">
                    <div className="form-group">
                        <label>Slug</label>
                        <input
                            onChange={(ev) => setSlug(ev.target.value)}
                            className="form-control"
                            value={slug}
                        />
                        {
                            errors['slug'] ? (
                                <ul>
                                    {errors['slug'].map((item, i) => (
                                        <li key={i}>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            ) : ''
                        }
                    </div>
                </div>
                <div className="col-12 text-center">
                    <button type="submit" className="btn btn-primary">Generate</button>
                </div>
                {
                    createdUrl ? (
                        <div className="col-12 text-center" style={{marginTop: '10px'}}>
                            <div className="card">
                                <div className="card-body">
                                    {createdUrl}
                                </div>
                            </div>
                        </div>
                    ) : ''
                }
            </div>
        </form>
    )
}

export default FormShort;
