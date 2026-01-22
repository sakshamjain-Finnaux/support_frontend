import DatePicker from 'react-date-picker';
import "./DatePicker.css"
import "./Calendar.css"
import { Controller } from 'react-hook-form';
import utilities from '../../../utilities';

export default function DateField({ control, name, rules = {}, title, minDate, maxDate }) {

    return (
        <Controller
            name={name}
            rules={rules}
            control={control}
            render={({ field: { value, onChange, onBlur, ref }, fieldState: { error, } }) => {
                if (value) {
                    value = utilities.convertMySqlDateToJSDate(value);
                }
                return (
                    <div className='w-full relative'>
                        <label className="block">

                            <div className='mb-1'>{title}</div>
                            <DatePicker
                                {...(minDate ? { minDate } : {})}
                                {...(maxDate ? { maxDate } : {})}
                                format='dd/MM/yyyy'
                                inputRef={ref}
                                className={"w-full " + (error ? "react-date-picker_error" : "")}
                                calendarClassName={"bg-body-800 text-body-300 rounded-md"}
                                onChange={(val) => {
                                    onChange(val && utilities.convertJsDateToMySqlDate(val));
                                }}
                                value={value} />

                        </label>
                        {error && <span className="absolute -bottom-4 text-xs text-error">{error.message}</span>}
                    </div>
                )
            }
            }

        />
    );
}